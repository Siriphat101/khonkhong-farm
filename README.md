# 🌾 KhonKhong Farm - ระบบฟาร์มอัตโนมัติ

ระบบจัดการฟาร์มอัจฉริยะพร้อม AI ช่วยวิเคราะห์และแนะนำการเพาะปลูก

## ✨ ฟีเจอร์

### Phase 1 - Dashboard
- 📊 **แดชบอร์ดเซ็นเซอร์** - แสดงข้อมูลอุณหภูมิ ความชื้น ความชื้นดิน pH แสง และลม แบบเรียลไทม์
- 📈 **กราฟข้อมูลย้อนหลัง** - แสดงกราฟข้อมูลเซ็นเซอร์ย้อนหลัง 24 ชั่วโมง
- 🔄 **รีเฟรชอัตโนมัติ** - อัปเดตข้อมูลทุก 30 วินาที

### AI ผู้ช่วยฟาร์ม
- 🌱 **แนะนำพืช** - วิเคราะห์สภาพแวดล้อมและแนะนำพืชที่เหมาะสมพร้อมคะแนนความเหมาะสม
- 🔬 **ตรวจโรค** - ตรวจจับความเสี่ยงของโรคพืชจากข้อมูลสภาพอากาศ
- 🧪 **แนะนำปุ๋ยและยา** - แนะนำปุ๋ยและยาป้องกันโรคที่เหมาะสม
- 📋 **สรุปผลวิเคราะห์** - สรุปผลวิเคราะห์ AI อัตโนมัติ

## 🚀 เริ่มต้นใช้งาน

### Frontend (Next.js)

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### Backend (Rust)

```bash
cd backend
cargo run
```

API server จะรันที่ [http://localhost:8080](http://localhost:8080)

#### API Endpoints

| Method | Path                  | คำอธิบาย                       |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/health`         | Health check                   |
| GET    | `/api/sensors`        | ข้อมูลเซ็นเซอร์ปัจจุบัน       |
| GET    | `/api/sensors/history`| ข้อมูลเซ็นเซอร์ย้อนหลัง 24 ชม.|
| GET    | `/api/insights`       | AI วิเคราะห์และแนะนำ          |

### Build สำหรับ Production

```bash
# Frontend
npm run build
npm start

# Backend
cd backend
cargo build --release
./target/release/khonkhong-farm-backend
```

## 🛠 เทคโนโลยี

**Frontend:**
- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

**Backend:**
- [Rust](https://www.rust-lang.org/) - Systems Programming Language
- [Actix-web](https://actix.rs/) - Web Framework
- [Serde](https://serde.rs/) - Serialization/Deserialization
- Clean Architecture - แยก Domain / Application / Infrastructure / Presentation

## 📁 โครงสร้างโปรเจค

```
khonkhong-farm/
├── src/                                # Frontend (Next.js)
│   ├── app/                            # Pages
│   ├── components/                     # React Components
│   ├── services/                       # Frontend Services
│   └── types/                          # TypeScript Types
│
└── backend/                            # Backend (Rust)
    └── src/
        ├── main.rs                     # Entry point & DI composition root
        ├── domain/                     # Domain Layer (business logic แท้ๆ)
        │   ├── models/                 # Domain Models
        │   │   ├── sensor.rs           # SensorData, SensorHistory
        │   │   ├── crop.rs             # CropRecommendation, CropInfo
        │   │   ├── disease.rs          # DiseaseAlert, RiskLevel
        │   │   ├── fertilizer.rs       # FertilizerRecommendation
        │   │   └── insight.rs          # AiInsight
        │   └── services/              # Domain Services (pure business logic)
        │       ├── crop_scoring.rs     # คำนวณคะแนนพืช
        │       ├── disease_detection.rs # ตรวจจับโรค
        │       └── fertilizer_recommendation.rs # แนะนำปุ๋ย
        ├── application/               # Application Layer (use cases & ports)
        │   ├── ports/                 # Trait-based ports (interfaces)
        │   │   ├── sensor_port.rs     # SensorDataProvider trait
        │   │   └── ai_port.rs         # AiAnalyzer trait
        │   └── use_cases/             # Application use cases
        │       ├── get_sensor_data.rs
        │       └── get_ai_insights.rs
        ├── infrastructure/            # Infrastructure Layer (adapters)
        │   ├── sensors/
        │   │   └── mock_sensor.rs     # Mock sensor (เปลี่ยนเป็น IoT จริงได้)
        │   └── ai/
        │       └── rule_based_analyzer.rs # Rule-based AI (เปลี่ยนเป็น LLM ได้)
        └── presentation/             # Presentation Layer (HTTP API)
            ├── handlers/              # Request handlers
            │   ├── health.rs
            │   ├── sensor.rs
            │   └── insight.rs
            └── routes/
                └── api.rs             # Route configuration
```

### 🏗 Clean Architecture (Backend)

```
┌─────────────────────────────────────────────┐
│              Presentation                    │
│         (HTTP handlers, routes)              │
├─────────────────────────────────────────────┤
│              Application                     │
│      (Use Cases, Ports/Traits)               │
├─────────────────────────────────────────────┤
│               Domain                         │
│   (Models, Business Logic Services)          │
│        ไม่มี dependencies ภายนอก             │
├─────────────────────────────────────────────┤
│            Infrastructure                    │
│  (Mock Sensors, Rule-based AI, DB adapters)  │
│     implement traits จาก Application         │
└─────────────────────────────────────────────┘
```

**หลักการ:**
- **Domain** → business logic แท้ๆ ไม่พึ่ง framework ใดๆ
- **Application** → กำหนด ports (traits) ให้ infrastructure implement
- **Infrastructure** → adapters ที่เปลี่ยนได้ (mock → real IoT, rule-based → LLM)
- **Presentation** → HTTP API layer

## 🔮 แผนพัฒนาในอนาคต

- เชื่อมต่อเซ็นเซอร์จริง (IoT) - implement `SensorDataProvider` trait สำหรับ Raspberry Pi 3B / ESP32
- เชื่อมต่อ LLM API - implement `AiAnalyzer` trait สำหรับ AI ที่ฉลาดขึ้น
- เพิ่ม Database layer (PostgreSQL / SQLite)
- ระบบแจ้งเตือน (Line, Email)
- ระบบควบคุมการรดน้ำอัตโนมัติ
- ระบบบันทึกข้อมูลและวิเคราะห์แนวโน้ม
- รองรับหลายแปลง/โซน
