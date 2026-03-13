use actix_web::{get, web, HttpResponse, Responder};

use crate::application::use_cases::get_ai_insights::GetAiInsightsUseCase;

#[get("/api/insights")]
pub async fn get_insights(
    use_case: web::Data<GetAiInsightsUseCase>,
) -> impl Responder {
    let insights = use_case.execute();
    HttpResponse::Ok().json(insights)
}
