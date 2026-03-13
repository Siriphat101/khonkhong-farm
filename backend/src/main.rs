mod domain;
mod application;
mod infrastructure;
mod presentation;

use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, middleware};
use log::info;

use application::use_cases::get_ai_insights::GetAiInsightsUseCase;
use application::use_cases::get_sensor_data::GetSensorDataUseCase;
use infrastructure::ai::rule_based_analyzer::RuleBasedAnalyzer;
use infrastructure::sensors::mock_sensor::MockSensorProvider;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a valid number");

    // --- Dependency Injection (Composition Root) ---
    let sensor_provider = Arc::new(MockSensorProvider::new());
    let ai_analyzer = Arc::new(RuleBasedAnalyzer::new());

    let sensor_use_case = GetSensorDataUseCase::new(sensor_provider.clone());
    let insight_use_case = GetAiInsightsUseCase::new(sensor_provider, ai_analyzer);

    let sensor_data = web::Data::new(sensor_use_case);
    let insight_data = web::Data::new(insight_use_case);

    info!("🌾 KhonKhong Farm Backend starting on {}:{}", host, port);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .app_data(sensor_data.clone())
            .app_data(insight_data.clone())
            .configure(presentation::routes::api::configure)
    })
    .bind((host.as_str(), port))?
    .run()
    .await
}
