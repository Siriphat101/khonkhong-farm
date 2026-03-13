use crate::domain::models::crop::{CropInfo, CropRecommendation};
use crate::domain::models::sensor::SensorData;

const CROP_DATABASE: &[CropInfo] = &[
    CropInfo {
        name: "Rice",
        name_th: "ข้าว",
        reason: "เหมาะกับสภาพอากาศร้อนชื้น ดินมีความชื้นสูง",
        season: "ฤดูฝน (มิ.ย. - พ.ย.)",
        growth_days: 120,
    },
    CropInfo {
        name: "Corn",
        name_th: "ข้าวโพด",
        reason: "เติบโตได้ดีในอุณหภูมิปานกลาง ดินระบายน้ำดี",
        season: "ตลอดปี",
        growth_days: 90,
    },
    CropInfo {
        name: "Cassava",
        name_th: "มันสำปะหลัง",
        reason: "ทนแล้งได้ดี เหมาะกับดินร่วนปนทราย",
        season: "ต้นฤดูฝน (เม.ย. - มิ.ย.)",
        growth_days: 270,
    },
    CropInfo {
        name: "Chili",
        name_th: "พริก",
        reason: "เหมาะกับอากาศอบอุ่น ดินมี pH เป็นกลาง",
        season: "ตลอดปี",
        growth_days: 75,
    },
    CropInfo {
        name: "Lettuce",
        name_th: "ผักกาดหอม",
        reason: "เหมาะกับอากาศเย็น ความชื้นสูง",
        season: "ฤดูหนาว (พ.ย. - ก.พ.)",
        growth_days: 45,
    },
    CropInfo {
        name: "Tomato",
        name_th: "มะเขือเทศ",
        reason: "เหมาะกับอุณหภูมิปานกลาง แสงแดดจัด",
        season: "ฤดูหนาว (ต.ค. - ก.พ.)",
        growth_days: 60,
    },
    CropInfo {
        name: "Sugarcane",
        name_th: "อ้อย",
        reason: "ต้องการน้ำมาก อุณหภูมิสูง",
        season: "ต้นฤดูฝน",
        growth_days: 365,
    },
    CropInfo {
        name: "Morning Glory",
        name_th: "ผักบุ้ง",
        reason: "เติบโตเร็ว ชอบน้ำมาก",
        season: "ตลอดปี",
        growth_days: 25,
    },
];

fn calculate_score(crop: &CropInfo, data: &SensorData) -> u32 {
    let mut score: u32 = 50;

    match crop.name {
        "Rice" => {
            if (25.0..=35.0).contains(&data.temperature) { score += 20; }
            if data.humidity >= 60.0 { score += 15; }
            if data.soil_moisture >= 60.0 { score += 15; }
            if (5.5..=7.0).contains(&data.ph) { score += 10; }
        }
        "Corn" => {
            if (20.0..=30.0).contains(&data.temperature) { score += 20; }
            if (40.0..=70.0).contains(&data.humidity) { score += 15; }
            if (30.0..=60.0).contains(&data.soil_moisture) { score += 15; }
            if (5.8..=7.0).contains(&data.ph) { score += 10; }
        }
        "Cassava" => {
            if (25.0..=35.0).contains(&data.temperature) { score += 20; }
            if data.soil_moisture <= 50.0 { score += 15; }
            if (5.5..=7.0).contains(&data.ph) { score += 10; }
            if data.humidity <= 70.0 { score += 10; }
        }
        "Chili" => {
            if (20.0..=30.0).contains(&data.temperature) { score += 20; }
            if (50.0..=70.0).contains(&data.humidity) { score += 15; }
            if (6.0..=7.0).contains(&data.ph) { score += 15; }
            if data.light >= 500.0 { score += 10; }
        }
        "Lettuce" => {
            if (15.0..=25.0).contains(&data.temperature) { score += 25; }
            if (60.0..=80.0).contains(&data.humidity) { score += 15; }
            if data.soil_moisture >= 50.0 { score += 10; }
            if (6.0..=7.0).contains(&data.ph) { score += 10; }
        }
        "Tomato" => {
            if (20.0..=30.0).contains(&data.temperature) { score += 20; }
            if data.light >= 600.0 { score += 15; }
            if (6.0..=7.0).contains(&data.ph) { score += 10; }
            if (40.0..=70.0).contains(&data.humidity) { score += 10; }
        }
        "Sugarcane" => {
            if (28.0..=38.0).contains(&data.temperature) { score += 20; }
            if data.soil_moisture >= 50.0 { score += 15; }
            if data.humidity >= 60.0 { score += 10; }
            if (5.5..=7.5).contains(&data.ph) { score += 10; }
        }
        "Morning Glory" => {
            if (25.0..=35.0).contains(&data.temperature) { score += 15; }
            if data.soil_moisture >= 60.0 { score += 20; }
            if data.humidity >= 60.0 { score += 10; }
            if (5.5..=7.0).contains(&data.ph) { score += 10; }
        }
        _ => {}
    }

    score.min(100)
}

pub fn recommend_crops(data: &SensorData) -> Vec<CropRecommendation> {
    let mut crops: Vec<CropRecommendation> = CROP_DATABASE
        .iter()
        .map(|crop| CropRecommendation {
            name: crop.name.to_string(),
            name_th: crop.name_th.to_string(),
            score: calculate_score(crop, data),
            reason: crop.reason.to_string(),
            season: crop.season.to_string(),
            growth_days: crop.growth_days,
        })
        .collect();

    crops.sort_by(|a, b| b.score.cmp(&a.score));
    crops
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
    fn test_rice_high_score_in_ideal_conditions() {
        let data = make_sensor_data(30.0, 70.0, 65.0, 6.5, 500.0, 5.0);
        let crops = recommend_crops(&data);
        let rice = crops.iter().find(|c| c.name == "Rice").unwrap();
        assert!(rice.score >= 90, "Rice score should be >= 90 in ideal conditions, got {}", rice.score);
    }

    #[test]
    fn test_lettuce_high_score_in_cool_humid() {
        let data = make_sensor_data(20.0, 70.0, 55.0, 6.5, 400.0, 3.0);
        let crops = recommend_crops(&data);
        let lettuce = crops.iter().find(|c| c.name == "Lettuce").unwrap();
        assert!(lettuce.score >= 90, "Lettuce score should be >= 90, got {}", lettuce.score);
    }

    #[test]
    fn test_crops_sorted_by_score_descending() {
        let data = make_sensor_data(28.0, 65.0, 50.0, 6.5, 600.0, 5.0);
        let crops = recommend_crops(&data);
        for window in crops.windows(2) {
            assert!(window[0].score >= window[1].score, "Crops should be sorted by score descending");
        }
    }

    #[test]
    fn test_all_crops_returned() {
        let data = make_sensor_data(25.0, 50.0, 40.0, 6.0, 500.0, 5.0);
        let crops = recommend_crops(&data);
        assert_eq!(crops.len(), 8, "Should return all 8 crops");
    }

    #[test]
    fn test_score_never_exceeds_100() {
        let data = make_sensor_data(30.0, 70.0, 65.0, 6.5, 800.0, 5.0);
        let crops = recommend_crops(&data);
        for crop in &crops {
            assert!(crop.score <= 100, "Score for {} should not exceed 100, got {}", crop.name, crop.score);
        }
    }
}
