// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  IncomingForm,
  type Files,
  type File as FormidableFile,
} from "formidable";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import { existsSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  url?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new IncomingForm({
      maxFileSize: 4 * 1024 * 1024, // 4MB
    });

    const [files] = await new Promise<[Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
          return;
        }
        resolve([files]);
      });
    });

    const fileData = files.file;
    const file: FormidableFile | undefined = Array.isArray(fileData)
      ? fileData[0]
      : fileData;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type. Only JPG, PNG, and WebP are allowed",
      });
    }

    // Read the file
    const buffer = await readFile(file.filepath);

    // Generate unique filename
    const fileExtension = file.originalFilename?.split(".").pop() ?? "jpg";
    const uniqueName = `${randomBytes(16).toString("hex")}.${fileExtension}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "images");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save to public/essenya/images directory
    const path = join(uploadDir, uniqueName);
    await writeFile(path, buffer);

    // Return the public URL
    const url = `/images/${uniqueName}`;

    return res.status(200).json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    // Return more detailed error in development
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";
    return res.status(500).json({
      error:
        process.env.NODE_ENV === "development" ? errorMessage : "Upload failed",
    });
  }
}
