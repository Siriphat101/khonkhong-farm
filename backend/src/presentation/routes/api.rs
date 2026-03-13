use actix_web::web;

use crate::presentation::handlers::{health, insight, sensor};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(health::health_check)
        .service(sensor::get_current_sensors)
        .service(sensor::get_sensor_history)
        .service(insight::get_insights);
}
