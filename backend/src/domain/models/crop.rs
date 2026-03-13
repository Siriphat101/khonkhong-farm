use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CropRecommendation {
    pub name: String,
    pub name_th: String,
    pub score: u32,
    pub reason: String,
    pub season: String,
    pub growth_days: u32,
}

#[derive(Debug, Clone)]
pub struct CropInfo {
    pub name: &'static str,
    pub name_th: &'static str,
    pub reason: &'static str,
    pub season: &'static str,
    pub growth_days: u32,
}
