use crate::domain::models::insight::AiInsight;
use crate::domain::models::sensor::SensorData;

/// Port for AI analysis engine.
/// Infrastructure adapters implement this trait.
pub trait AiAnalyzer: Send + Sync {
    fn analyze(&self, data: &SensorData) -> AiInsight;
}
