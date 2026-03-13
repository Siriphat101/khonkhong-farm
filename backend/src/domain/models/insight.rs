use serde::{Deserialize, Serialize};

use super::crop::CropRecommendation;
use super::disease::DiseaseAlert;
use super::fertilizer::FertilizerRecommendation;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiInsight {
    pub crops: Vec<CropRecommendation>,
    pub diseases: Vec<DiseaseAlert>,
    pub fertilizers: Vec<FertilizerRecommendation>,
    pub summary: String,
}
