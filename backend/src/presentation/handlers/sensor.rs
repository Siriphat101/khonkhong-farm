use actix_web::{get, web, HttpResponse, Responder};

use crate::application::use_cases::get_sensor_data::GetSensorDataUseCase;

#[get("/api/sensors")]
pub async fn get_current_sensors(
    use_case: web::Data<GetSensorDataUseCase>,
) -> impl Responder {
    let data = use_case.get_current();
    HttpResponse::Ok().json(data)
}

#[get("/api/sensors/history")]
pub async fn get_sensor_history(
    use_case: web::Data<GetSensorDataUseCase>,
) -> impl Responder {
    let history = use_case.get_history(24);
    HttpResponse::Ok().json(history)
}
