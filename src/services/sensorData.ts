import { SensorData, SensorHistory } from "@/types";

export function generateCurrentSensorData(): SensorData {
  return {
    temperature: parseFloat((25 + Math.random() * 15).toFixed(1)),
    humidity: parseFloat((40 + Math.random() * 50).toFixed(1)),
    soilMoisture: parseFloat((20 + Math.random() * 60).toFixed(1)),
    ph: parseFloat((5.5 + Math.random() * 2.5).toFixed(1)),
    light: parseFloat((200 + Math.random() * 800).toFixed(0)),
    windSpeed: parseFloat((0 + Math.random() * 20).toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

export function generateSensorHistory(
  hours: number = 24
): Record<string, SensorHistory[]> {
  const labels: string[] = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    labels.push(
      time.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
    );
  }

  const generateValues = (base: number, variance: number): SensorHistory[] =>
    labels.map((label) => ({
      label,
      value: parseFloat((base + Math.random() * variance).toFixed(1)),
    }));

  return {
    temperature: generateValues(25, 15),
    humidity: generateValues(40, 50),
    soilMoisture: generateValues(20, 60),
    ph: generateValues(5.5, 2.5),
    light: generateValues(200, 800),
    windSpeed: generateValues(0, 20),
  };
}
