import fs from "fs";
import imageType from "image-type";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getImageDir() {
  return process.env.NODE_ENV === "test"
    ? path.join(__dirname, "test-images")
    : path.join(__dirname, "images");
}

export async function saveImage(base64: string) {
  const tempDir = getImageDir();
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const buffer = Buffer.from(base64, "base64");
  const type = await imageType(buffer);

  if (!type) throw new Error("Unidentified image type");

  const fileName = `${crypto.randomUUID()}.${type}`;
  const filePath = path.join(tempDir, fileName);

  await writeFile(filePath, buffer);

  return { filePath, type: type.mime, fileName };
}

export function extractIntegerNumber(phrase: string) {
  const result = phrase.match(/\d+(\.\d+)?/);

  if (result) {
    const floatNumber = parseFloat(result[0]);
    return Math.floor(floatNumber);
  }

  throw new Error("Number not found");
}
