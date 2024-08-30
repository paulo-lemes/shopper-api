import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { env } from "../env.ts";
import { saveImage } from "../utils.ts";

const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

interface UploadImageParams {
  filePath: string;
  type: string;
  fileName: string;
}

async function uploadImage({ filePath, type, fileName }: UploadImageParams) {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: type,
    displayName: fileName,
  });

  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );
  return uploadResponse;
}

export async function analyzeImageMeasurement(base64Image: string) {
  try {
    const image = await saveImage(base64Image);
    const responseUploadedImage = await uploadImage(image);

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: responseUploadedImage.file.mimeType,
          fileUri: responseUploadedImage.file.uri,
        },
      },
      {
        text: "Extraia a leitura do medidor a partir desta imagem e retorne somente números inteiros.",
      },
    ]);

    const promptResponse = result.response.text();
    console.log("Prompt response:", promptResponse);
    return { promptResponse, imageUrl: responseUploadedImage.file.uri };
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error(`Error analyzing image: ${error}`);
  }
}
