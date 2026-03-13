use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum FertilizerType {
    Organic,
    Chemical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FertilizerRecommendation {
    pub name: String,
    pub name_th: String,
    #[serde(rename = "type")]
    pub fertilizer_type: FertilizerType,
    pub usage: String,
    pub frequency: String,
}
