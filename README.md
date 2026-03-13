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

### ติดตั้ง Dependencies

```bash
npm install
```

### รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### Build สำหรับ Production

```bash
npm run build
npm start
```

## 🛠 เทคโนโลยี

- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- Rule-based AI Engine - สำหรับวิเคราะห์และแนะนำ

## 📁 โครงสร้างโปรเจค

```
src/
├── app/
│   ├── layout.tsx          # Layout หลัก
│   ├── page.tsx            # หน้า Dashboard
│   ├── globals.css         # Global styles
│   └── assistant/
│       └── page.tsx        # หน้า AI ผู้ช่วยฟาร์ม
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   ├── SensorCard.tsx              # การ์ดแสดงข้อมูลเซ็นเซอร์
│   ├── SensorChart.tsx             # กราฟข้อมูลเซ็นเซอร์
│   ├── CropRecommendationCard.tsx  # การ์ดแนะนำพืช
│   ├── DiseaseAlertCard.tsx        # การ์ดแจ้งเตือนโรค
│   └── FertilizerCard.tsx          # การ์ดแนะนำปุ๋ย
├── services/
│   ├── sensorData.ts       # บริการข้อมูลเซ็นเซอร์ (mock)
│   └── aiRecommendation.ts # AI Engine สำหรับวิเคราะห์
└── types/
    └── index.ts            # TypeScript types
```

## 🔮 แผนพัฒนาในอนาคต

- เชื่อมต่อเซ็นเซอร์จริง (IoT)
- เชื่อมต่อ LLM API สำหรับ AI ที่ฉลาดขึ้น
- ระบบแจ้งเตือน (Line, Email)
- ระบบควบคุมการรดน้ำอัตโนมัติ
- ระบบบันทึกข้อมูลและวิเคราะห์แนวโน้ม
- รองรับหลายแปลง/โซน
