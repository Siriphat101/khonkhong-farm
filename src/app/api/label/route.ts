import { NextRequest, NextResponse } from "next/server";

interface LabelRequest {
  imageBase64: string;
  prompt: string;
  apiKey: string;
  model: string;
}

export async function POST(request: NextRequest) {
  let body: LabelRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { imageBase64, prompt, apiKey, model } = body;

  if (!imageBase64 || !prompt || !apiKey || !model) {
    return NextResponse.json(
      { error: "Missing required fields: imageBase64, prompt, apiKey, model" },
      { status: 400 }
    );
  }

  // Determine the media type from the base64 data URL prefix
  let mediaType = "image/jpeg";
  if (imageBase64.startsWith("data:image/png")) {
    mediaType = "image/png";
  } else if (imageBase64.startsWith("data:image/webp")) {
    mediaType = "image/webp";
  }

  // Strip the data URL prefix if present
  const base64Data = imageBase64.includes(",")
    ? imageBase64.split(",")[1]
    : imageBase64;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${base64Data}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status} - ${errorBody}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";

    return NextResponse.json({ result: content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to call LLM API: ${message}` },
      { status: 500 }
    );
  }
}
