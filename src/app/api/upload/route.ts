import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

function getSafeFilename(name: string) {
  const timestamp = Date.now();
  const extension = path.extname(name) || ".png";
  const baseName = "logo";
  return `${baseName}-${timestamp}${extension}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing file upload field named 'file'." },
        { status: 400 }
      );
    }

    const fileName = getSafeFilename(file.name ?? "upload.png");
    const targetPath = path.join(uploadDirectory, fileName);

    await fs.mkdir(uploadDirectory, { recursive: true });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, fileBuffer);

    const publicPath = `/uploads/${fileName}`;
    return NextResponse.json({ path: publicPath }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Unable to upload file." },
      { status: 500 }
    );
  }
}
