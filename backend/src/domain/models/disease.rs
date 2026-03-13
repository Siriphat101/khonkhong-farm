use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiseaseAlert {
    pub name: String,
    pub name_th: String,
    pub risk: RiskLevel,
    pub description: String,
    pub prevention: String,
}
