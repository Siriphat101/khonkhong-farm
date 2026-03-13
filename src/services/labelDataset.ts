import { BoundingBox, LabelClass } from "@/types";

/**
 * Build the system prompt for the LLM vision model to detect objects and return bounding boxes.
 */
export function buildLabelingPrompt(
  classes: LabelClass[],
  customPrompt: string
): string {
  const classList = classes.map((c) => `${c.id}: ${c.name}`).join("\n");

  return `You are an expert object detection labeling assistant. Your task is to detect objects in the image and return bounding boxes in a structured format.

${customPrompt ? `Additional instructions: ${customPrompt}\n` : ""}
Detect all objects that belong to these classes:
${classList}

For each detected object, return a bounding box with:
- className: the class name from the list above
- xCenter: x coordinate of the center of the bounding box (normalized 0-1, relative to image width)
- yCenter: y coordinate of the center of the bounding box (normalized 0-1, relative to image height)
- width: width of the bounding box (normalized 0-1, relative to image width)
- height: height of the bounding box (normalized 0-1, relative to image height)
- confidence: your confidence in the detection (0-1)

IMPORTANT:
- All coordinates must be normalized between 0 and 1
- xCenter and yCenter represent the CENTER of the bounding box
- Return ONLY the JSON array, no other text
- If no objects are detected, return an empty array []

Response format (JSON array only):
[{"className": "example", "xCenter": 0.5, "yCenter": 0.5, "width": 0.3, "height": 0.4, "confidence": 0.95}]`;
}

/**
 * Parse the LLM response into BoundingBox array with class ID mapping.
 */
export function parseLLMResponse(
  response: string,
  classes: LabelClass[]
): BoundingBox[] {
  const classMap = new Map(classes.map((c) => [c.name.toLowerCase(), c.id]));

  // Extract JSON array from the response
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  let parsed: Array<{
    className: string;
    xCenter: number;
    yCenter: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (item) =>
        item.className &&
        typeof item.xCenter === "number" &&
        typeof item.yCenter === "number" &&
        typeof item.width === "number" &&
        typeof item.height === "number"
    )
    .map((item) => {
      const classId = classMap.get(item.className.toLowerCase()) ?? -1;
      return {
        classId,
        className: item.className,
        xCenter: clamp(item.xCenter, 0, 1),
        yCenter: clamp(item.yCenter, 0, 1),
        width: clamp(item.width, 0, 1),
        height: clamp(item.height, 0, 1),
        confidence: clamp(item.confidence ?? 0.5, 0, 1),
      };
    })
    .filter((box) => box.classId >= 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Convert bounding boxes to YOLO format string.
 * YOLO format: class_id x_center y_center width height (one per line)
 */
export function toYOLOFormat(boxes: BoundingBox[]): string {
  return boxes
    .map(
      (box) =>
        `${box.classId} ${box.xCenter.toFixed(6)} ${box.yCenter.toFixed(6)} ${box.width.toFixed(6)} ${box.height.toFixed(6)}`
    )
    .join("\n");
}

/**
 * Generate classes.txt content for YOLO training.
 */
export function generateClassesTxt(classes: LabelClass[]): string {
  const sorted = [...classes].sort((a, b) => a.id - b.id);
  return sorted.map((c) => c.name).join("\n");
}

/**
 * Trigger a file download in the browser.
 */
export function downloadFile(content: string, fileName: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
