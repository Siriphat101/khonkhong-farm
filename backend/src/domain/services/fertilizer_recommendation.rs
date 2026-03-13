use crate::domain::models::fertilizer::{FertilizerRecommendation, FertilizerType};
use crate::domain::models::sensor::SensorData;

pub fn recommend_fertilizers(data: &SensorData) -> Vec<FertilizerRecommendation> {
    let mut fertilizers = Vec::new();

    if data.ph < 6.0 {
        fertilizers.push(FertilizerRecommendation {
            name: "Dolomite Lime".to_string(),
            name_th: "โดโลไมท์".to_string(),
            fertilizer_type: FertilizerType::Chemical,
            usage: "ใส่โดโลไมท์ 100-200 กก./ไร่ เพื่อเพิ่มค่า pH ของดิน".to_string(),
            frequency: "ทุก 3-6 เดือน".to_string(),
        });
    }

    if data.ph > 7.5 {
        fertilizers.push(FertilizerRecommendation {
            name: "Sulfur".to_string(),
            name_th: "กำมะถัน".to_string(),
            fertilizer_type: FertilizerType::Chemical,
            usage: "ใส่กำมะถัน 20-40 กก./ไร่ เพื่อลดค่า pH ของดิน".to_string(),
            frequency: "ทุก 3-6 เดือน".to_string(),
        });
    }

    if data.soil_moisture < 30.0 {
        fertilizers.push(FertilizerRecommendation {
            name: "Compost".to_string(),
            name_th: "ปุ๋ยหมัก".to_string(),
            fertilizer_type: FertilizerType::Organic,
            usage: "ใส่ปุ๋ยหมัก 500-1000 กก./ไร่ เพื่อเพิ่มความสามารถในการอุ้มน้ำของดิน".to_string(),
            frequency: "ทุก 1-2 เดือน".to_string(),
        });
    }

    fertilizers.push(FertilizerRecommendation {
        name: "NPK 15-15-15".to_string(),
        name_th: "ปุ๋ยสูตร 15-15-15".to_string(),
        fertilizer_type: FertilizerType::Chemical,
        usage: "ใส่ปุ๋ย 25-50 กก./ไร่ เป็นปุ๋ยรองพื้นก่อนปลูก".to_string(),
        frequency: "ก่อนปลูกและทุก 1-2 เดือน".to_string(),
    });

    fertilizers.push(FertilizerRecommendation {
        name: "Organic Fertilizer".to_string(),
        name_th: "ปุ๋ยอินทรีย์".to_string(),
        fertilizer_type: FertilizerType::Organic,
        usage: "ใส่ปุ๋ยอินทรีย์ 200-500 กก./ไร่ เพื่อปรับปรุงโครงสร้างดินและเพิ่มจุลินทรีย์".to_string(),
        frequency: "ทุก 1-3 เดือน".to_string(),
    });

    fertilizers
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_sensor_data(ph: f64, soil_moisture: f64) -> SensorData {
        SensorData {
            temperature: 25.0,
            humidity: 50.0,
            soil_moisture,
            ph,
            light: 500.0,
            wind_speed: 5.0,
            timestamp: "2024-01-01T00:00:00Z".to_string(),
        }
    }

    #[test]
    fn test_dolomite_for_acidic_soil() {
        let data = make_sensor_data(5.0, 50.0);
        let ferts = recommend_fertilizers(&data);
        assert!(ferts.iter().any(|f| f.name == "Dolomite Lime"));
    }

    #[test]
    fn test_sulfur_for_alkaline_soil() {
        let data = make_sensor_data(8.0, 50.0);
        let ferts = recommend_fertilizers(&data);
        assert!(ferts.iter().any(|f| f.name == "Sulfur"));
    }

    #[test]
    fn test_compost_for_dry_soil() {
        let data = make_sensor_data(6.5, 20.0);
        let ferts = recommend_fertilizers(&data);
        assert!(ferts.iter().any(|f| f.name == "Compost"));
    }

    #[test]
    fn test_always_includes_npk_and_organic() {
        let data = make_sensor_data(6.5, 50.0);
        let ferts = recommend_fertilizers(&data);
        assert!(ferts.iter().any(|f| f.name == "NPK 15-15-15"));
        assert!(ferts.iter().any(|f| f.name == "Organic Fertilizer"));
    }

    #[test]
    fn test_normal_soil_returns_baseline_only() {
        let data = make_sensor_data(6.5, 50.0);
        let ferts = recommend_fertilizers(&data);
        assert_eq!(ferts.len(), 2, "Normal soil should only return NPK and Organic");
    }
}
