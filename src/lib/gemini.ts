import { GoogleGenerativeAI } from "@google/generative-ai";
import imageType from "image-type";
import { env } from "../env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

async function verifyMimeTypeBase64(base64: string) {
  const dataUriRegex = /^data:(image\/[^;]+);base64,/;
  const match = base64.match(dataUriRegex);

  if (match) {
    const mimeType = match[1];
    return {
      mimeType,
      uri: base64,
    };
  }

  const buffer = Buffer.from(base64, "base64");
  const type = await imageType(buffer);

  if (!type) throw new Error("Unidentified image type");

  return {
    mimeType: type.mime,
    uri: `data:${type.mime};base64,${base64}`,
  };
}

export async function analyzeImageMeasurement(base64Image: string) {
  try {
    const image = await verifyMimeTypeBase64(base64Image);

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: image.mimeType,
          fileUri: image.uri,
        },
      },
      { text: "Extraia a leitura do medidor a partir desta imagem." },
    ]);

    const measureValue = result.response.text();
    console.log("Measure value:", measureValue);
    return measureValue;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error(`Error analyzing image: ${error}`);
  }
}
