import fs from "fs";
import { writeFile } from "fs/promises";
import imageType from "image-type";
import path from "path";

export async function saveImage(base64: string) {
  const tempDir = path.join(__dirname, "images");
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
