"use server";

export async function uploadImageToImageKit(base64File: string, fileName: string) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("IMAGEKIT_PRIVATE_KEY is not configured in .env.local");
    }

    // ImageKit expects Basic Auth with private key base64-encoded with a trailing colon
    const authHeader = Buffer.from(privateKey + ":").toString("base64");
    
    const formData = new FormData();
    formData.append("file", base64File);
    formData.append("fileName", fileName);
    formData.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ImageKit upload failed: ${errText}`);
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      fileId: data.fileId,
    };
  } catch (error: any) {
    console.error("ImageKit upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image to ImageKit",
    };
  }
}
