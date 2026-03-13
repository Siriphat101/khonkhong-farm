use crate::domain::models::disease::{DiseaseAlert, RiskLevel};
use crate::domain::models::sensor::SensorData;

pub fn detect_diseases(data: &SensorData) -> Vec<DiseaseAlert> {
    let mut diseases = Vec::new();

    if data.humidity > 80.0 && data.temperature > 25.0 {
        diseases.push(DiseaseAlert {
            name: "Fungal Infection".to_string(),
            name_th: "โรคเชื้อรา".to_string(),
            risk: RiskLevel::High,
            description: "ความชื้นสูงและอุณหภูมิอุ่นเป็นสภาพที่เหมาะสมกับการเจริญเติบโตของเชื้อรา".to_string(),
            prevention: "ลดความชื้นโดยการระบายอากาศ ใช้สารป้องกันเชื้อรา เช่น แมนโคเซบ หรือคาร์เบนดาซิม".to_string(),
        });
    }

    if data.humidity > 70.0 && data.temperature > 28.0 {
        let risk = if data.humidity > 85.0 {
            RiskLevel::High
        } else {
            RiskLevel::Medium
        };
        diseases.push(DiseaseAlert {
            name: "Bacterial Wilt".to_string(),
            name_th: "โรคเหี่ยวจากแบคทีเรีย".to_string(),
            risk,
            description: "แบคทีเรียในดินที่ทำให้พืชเหี่ยวและตาย พบมากในสภาพอากาศร้อนชื้น".to_string(),
            prevention: "หมุนเวียนพืช หลีกเลี่ยงการรดน้ำมากเกินไป ใช้พืชพันธุ์ต้านทาน".to_string(),
        });
    }

    if data.temperature > 35.0 && data.light > 800.0 {
        diseases.push(DiseaseAlert {
            name: "Sunscald".to_string(),
            name_th: "โรคใบไหม้จากแดด".to_string(),
            risk: RiskLevel::Medium,
            description: "แสงแดดจัดและอุณหภูมิสูงทำให้ใบพืชไหม้ เซลล์พืชเสียหาย".to_string(),
            prevention: "ใช้ตาข่ายพรางแสง ให้น้ำสม่ำเสมอ ปลูกพืชคลุมดิน".to_string(),
        });
    }

    if data.soil_moisture > 80.0 {
        diseases.push(DiseaseAlert {
            name: "Root Rot".to_string(),
            name_th: "โรครากเน่า".to_string(),
            risk: RiskLevel::High,
            description: "ดินที่ชื้นเกินไปทำให้รากพืชขาดอากาศและเน่าเสีย".to_string(),
            prevention: "ปรับปรุงระบบระบายน้ำ ลดปริมาณการรดน้ำ ใช้ไตรโคเดอร์มา".to_string(),
        });
    }

    if data.humidity < 30.0 && data.temperature > 30.0 {
        diseases.push(DiseaseAlert {
            name: "Spider Mites".to_string(),
            name_th: "ไรแดง".to_string(),
            risk: RiskLevel::Medium,
            description: "สภาพอากาศร้อนและแห้งเหมาะกับการระบาดของไรแดง".to_string(),
            prevention: "พ่นน้ำบนใบพืชเพื่อเพิ่มความชื้น ใช้สารกำจัดไร หรือปล่อยแมลงศัตรูธรรมชาติ".to_string(),
        });
    }

    if diseases.is_empty() {
        diseases.push(DiseaseAlert {
            name: "No significant risk".to_string(),
            name_th: "ไม่พบความเสี่ยงที่สำคัญ".to_string(),
            risk: RiskLevel::Low,
            description: "สภาพแวดล้อมปัจจุบันอยู่ในเกณฑ์ปกติ ไม่พบปัจจัยเสี่ยงของโรค".to_string(),
            prevention: "ตรวจสอบแปลงเป็นประจำ รักษาความสะอาด และหมุนเวียนพืช".to_string(),
        });
    }

    diseases
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_sensor_data(temp: f64, humidity: f64, soil: f64, ph: f64, light: f64, wind: f64) -> SensorData {
        SensorData {
            temperature: temp,
            humidity: humidity,
            soil_moisture: soil,
            ph: ph,
            light: light,
            wind_speed: wind,
            timestamp: "2024-01-01T00:00:00Z".to_string(),
        }
    }

    #[test]
    fn test_fungal_infection_in_hot_humid() {
        let data = make_sensor_data(30.0, 85.0, 50.0, 6.5, 500.0, 5.0);
        let diseases = detect_diseases(&data);
        assert!(diseases.iter().any(|d| d.name == "Fungal Infection"));
    }

    #[test]
    fn test_root_rot_in_wet_soil() {
        let data = make_sensor_data(25.0, 50.0, 85.0, 6.5, 500.0, 5.0);
        let diseases = detect_diseases(&data);
        assert!(diseases.iter().any(|d| d.name == "Root Rot"));
    }

    #[test]
    fn test_spider_mites_in_hot_dry() {
        let data = make_sensor_data(35.0, 25.0, 30.0, 6.5, 500.0, 5.0);
        let diseases = detect_diseases(&data);
        assert!(diseases.iter().any(|d| d.name == "Spider Mites"));
    }

    #[test]
    fn test_no_risk_in_normal_conditions() {
        let data = make_sensor_data(25.0, 50.0, 40.0, 6.5, 500.0, 5.0);
        let diseases = detect_diseases(&data);
        assert_eq!(diseases.len(), 1);
        assert_eq!(diseases[0].risk, RiskLevel::Low);
    }

    #[test]
    fn test_sunscald_in_extreme_heat_and_light() {
        let data = make_sensor_data(38.0, 40.0, 40.0, 6.5, 900.0, 5.0);
        let diseases = detect_diseases(&data);
        assert!(diseases.iter().any(|d| d.name == "Sunscald"));
    }

    #[test]
    fn test_bacterial_wilt_high_risk_above_85_humidity() {
        let data = make_sensor_data(30.0, 90.0, 50.0, 6.5, 500.0, 5.0);
        let diseases = detect_diseases(&data);
        let wilt = diseases.iter().find(|d| d.name == "Bacterial Wilt").unwrap();
        assert_eq!(wilt.risk, RiskLevel::High);
    }
}
