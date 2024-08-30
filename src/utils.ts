import fs from "fs";
import sizeOf from "image-size";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

function getImageDir() {
  const dirname = process.env.APP_DIRNAME || __dirname;

  return process.env.NODE_ENV === "test"
    ? path.join(dirname, "test-images")
    : path.join(dirname, "images");
}

export async function saveImage(base64: string) {
  const tempDir = getImageDir();
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const buffer = Buffer.from(base64, "base64");
  const type = sizeOf(buffer).type === "jpg" ? "jpeg" : sizeOf(buffer).type;

  if (!type) throw new Error("Unidentified image type");

  const fileName = `${crypto.randomUUID()}.${type}`;
  const filePath = path.join(tempDir, fileName);

  await writeFile(filePath, buffer);

  return { filePath, type: "image/" + type, fileName };
}

export function extractIntegerNumber(phrase: string) {
  const result = phrase.match(/\d+(\.\d+)?/);

  if (result) {
    const floatNumber = parseFloat(result[0]);
    return Math.floor(floatNumber);
  }

  throw new Error("Number not found");
}
