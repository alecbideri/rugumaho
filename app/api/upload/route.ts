import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity";

export const maxDuration = 60; // 60 seconds max duration on serverless
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = (formData.get("fileName") as string) || `image_${Date.now()}.jpg`;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // Convert file to Buffer and base64 string
    let buffer: Buffer;
    let base64String: string;

    if (typeof file === "string") {
      const match = file.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
      const cleanBase64 = match ? match[1] : file;
      buffer = Buffer.from(cleanBase64, "base64");
      base64String = cleanBase64;
    } else if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      base64String = buffer.toString("base64");
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported file payload format." },
        { status: 400 }
      );
    }

    // Attempt 1: Upload to ImageKit if configured
    const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (imagekitPrivateKey) {
      try {
        const authHeader = Buffer.from(imagekitPrivateKey + ":").toString("base64");
        const ikFormData = new FormData();
        ikFormData.append("file", base64String);
        ikFormData.append("fileName", fileName);
        ikFormData.append("useUniqueFileName", "true");

        const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
          },
          body: ikFormData,
        });

        if (ikRes.ok) {
          const data = await ikRes.json();
          return NextResponse.json({
            success: true,
            url: data.url,
            fileId: data.fileId,
            provider: "imagekit",
          });
        }

        const errText = await ikRes.text();
        console.warn("ImageKit returned non-OK status, trying Sanity fallback:", errText);
      } catch (ikError) {
        console.warn("ImageKit upload error, trying Sanity fallback:", ikError);
      }
    }

    // Attempt 2: Fallback to Sanity Global CDN
    try {
      const asset = await sanityWriteClient.assets.upload("image", buffer, {
        filename: fileName,
      });

      if (asset?.url) {
        return NextResponse.json({
          success: true,
          url: asset.url,
          fileId: asset._id,
          provider: "sanity",
        });
      }
    } catch (sanityError: any) {
      console.error("Sanity upload fallback also failed:", sanityError);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed. Please ensure IMAGEKIT_PRIVATE_KEY or SANITY_API_WRITE_TOKEN is configured in Vercel settings.",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("API /api/upload unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during image upload.",
      },
      { status: 500 }
    );
  }
}
