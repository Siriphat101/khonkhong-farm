use actix_web::{get, HttpResponse, Responder};
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
    version: &'static str,
}

#[get("/api/health")]
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(HealthResponse {
        status: "ok",
        service: "khonkhong-farm-backend",
        version: env!("CARGO_PKG_VERSION"),
    })
}
