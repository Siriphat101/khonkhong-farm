use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SensorData {
    pub temperature: f64,
    pub humidity: f64,
    pub soil_moisture: f64,
    pub ph: f64,
    pub light: f64,
    pub wind_speed: f64,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SensorHistory {
    pub label: String,
    pub value: f64,
}
