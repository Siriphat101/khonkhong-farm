use std::sync::Arc;

use crate::application::ports::sensor_port::SensorDataProvider;
use crate::domain::models::sensor::{SensorData, SensorHistory};

pub struct GetSensorDataUseCase {
    sensor_provider: Arc<dyn SensorDataProvider>,
}

impl GetSensorDataUseCase {
    pub fn new(sensor_provider: Arc<dyn SensorDataProvider>) -> Self {
        Self { sensor_provider }
    }

    pub fn get_current(&self) -> SensorData {
        self.sensor_provider.get_current_data()
    }

    pub fn get_history(&self, hours: u32) -> std::collections::HashMap<String, Vec<SensorHistory>> {
        self.sensor_provider.get_history(hours)
    }
}
