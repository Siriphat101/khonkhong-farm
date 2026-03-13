use std::sync::Arc;

use crate::application::ports::ai_port::AiAnalyzer;
use crate::application::ports::sensor_port::SensorDataProvider;
use crate::domain::models::insight::AiInsight;

pub struct GetAiInsightsUseCase {
    sensor_provider: Arc<dyn SensorDataProvider>,
    ai_analyzer: Arc<dyn AiAnalyzer>,
}

impl GetAiInsightsUseCase {
    pub fn new(
        sensor_provider: Arc<dyn SensorDataProvider>,
        ai_analyzer: Arc<dyn AiAnalyzer>,
    ) -> Self {
        Self {
            sensor_provider,
            ai_analyzer,
        }
    }

    pub fn execute(&self) -> AiInsight {
        let data = self.sensor_provider.get_current_data();
        self.ai_analyzer.analyze(&data)
    }
}
