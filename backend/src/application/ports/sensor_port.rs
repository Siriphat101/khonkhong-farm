use crate::domain::models::sensor::{SensorData, SensorHistory};

/// Port for sensor data providers (e.g., mock, real IoT, database).
/// Infrastructure adapters implement this trait.
pub trait SensorDataProvider: Send + Sync {
    fn get_current_data(&self) -> SensorData;
    fn get_history(&self, hours: u32) -> std::collections::HashMap<String, Vec<SensorHistory>>;
}
