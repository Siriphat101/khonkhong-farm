use std::collections::HashMap;

use chrono::Utc;
use rand::Rng;

use crate::application::ports::sensor_port::SensorDataProvider;
use crate::domain::models::sensor::{SensorData, SensorHistory};

/// Mock sensor data provider for development and testing.
/// Replace this with a real IoT adapter (e.g., MQTT, serial) for production.
pub struct MockSensorProvider;

impl MockSensorProvider {
    pub fn new() -> Self {
        Self
    }
}

impl Default for MockSensorProvider {
    fn default() -> Self {
        Self::new()
    }
}

impl SensorDataProvider for MockSensorProvider {
    fn get_current_data(&self) -> SensorData {
        let mut rng = rand::rng();
        SensorData {
            temperature: round1(25.0 + rng.random_range(0.0..15.0)),
            humidity: round1(40.0 + rng.random_range(0.0..50.0)),
            soil_moisture: round1(20.0 + rng.random_range(0.0..60.0)),
            ph: round1(5.5 + rng.random_range(0.0..2.5)),
            light: (200.0_f64 + rng.random_range(0.0..800.0)).round(),
            wind_speed: round1(rng.random_range(0.0..20.0)),
            timestamp: Utc::now().to_rfc3339(),
        }
    }

    fn get_history(&self, hours: u32) -> HashMap<String, Vec<SensorHistory>> {
        let mut rng = rand::rng();
        let now = Utc::now();

        let labels: Vec<String> = (0..=hours)
            .rev()
            .map(|i| {
                let time = now - chrono::Duration::hours(i as i64);
                time.format("%H:%M").to_string()
            })
            .collect();

        let mut generate_values = |base: f64, variance: f64| -> Vec<SensorHistory> {
            labels
                .iter()
                .map(|label| SensorHistory {
                    label: label.clone(),
                    value: round1(base + rng.random_range(0.0..variance)),
                })
                .collect()
        };

        let mut history = HashMap::new();
        history.insert("temperature".to_string(), generate_values(25.0, 15.0));
        history.insert("humidity".to_string(), generate_values(40.0, 50.0));
        history.insert("soilMoisture".to_string(), generate_values(20.0, 60.0));
        history.insert("ph".to_string(), generate_values(5.5, 2.5));
        history.insert("light".to_string(), generate_values(200.0, 800.0));
        history.insert("windSpeed".to_string(), generate_values(0.0, 20.0));
        history
    }
}

fn round1(val: f64) -> f64 {
    (val * 10.0).round() / 10.0
}
