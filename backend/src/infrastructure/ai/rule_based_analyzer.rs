use crate::application::ports::ai_port::AiAnalyzer;
use crate::domain::models::disease::RiskLevel;
use crate::domain::models::insight::AiInsight;
use crate::domain::models::sensor::SensorData;
use crate::domain::services::crop_scoring;
use crate::domain::services::disease_detection;
use crate::domain::services::fertilizer_recommendation;

/// Rule-based AI analyzer using domain services.
/// Can be replaced with an LLM-based adapter in the future.
pub struct RuleBasedAnalyzer;

impl RuleBasedAnalyzer {
    pub fn new() -> Self {
        Self
    }
}

impl Default for RuleBasedAnalyzer {
    fn default() -> Self {
        Self::new()
    }
}

impl AiAnalyzer for RuleBasedAnalyzer {
    fn analyze(&self, data: &SensorData) -> AiInsight {
        let crops = crop_scoring::recommend_crops(data);
        let diseases = disease_detection::detect_diseases(data);
        let fertilizers = fertilizer_recommendation::recommend_fertilizers(data);

        let top_crop = &crops[0];
        let high_risk_diseases: Vec<&str> = diseases
            .iter()
            .filter(|d| d.risk == RiskLevel::High)
            .map(|d| d.name_th.as_str())
            .collect();

        let mut summary = format!(
            "📊 วิเคราะห์จากข้อมูลเซ็นเซอร์: อุณหภูมิ {}°C, ความชื้น {}%, ความชื้นดิน {}%, pH {}\n\n",
            data.temperature, data.humidity, data.soil_moisture, data.ph
        );

        summary.push_str(&format!(
            "🌱 พืชแนะนำอันดับ 1: {} ({}) - คะแนนความเหมาะสม {}%\n",
            top_crop.name_th, top_crop.name, top_crop.score
        ));

        if !high_risk_diseases.is_empty() {
            summary.push_str(&format!(
                "\n⚠️ พบความเสี่ยงโรค {} รายการ: {}\n",
                high_risk_diseases.len(),
                high_risk_diseases.join(", ")
            ));
        } else {
            summary.push_str("\n✅ ไม่พบความเสี่ยงโรคที่สำคัญ\n");
        }

        summary.push_str(&format!("\n💡 คำแนะนำ: {}", fertilizers[0].usage));

        AiInsight {
            crops,
            diseases,
            fertilizers,
            summary,
        }
    }
}
