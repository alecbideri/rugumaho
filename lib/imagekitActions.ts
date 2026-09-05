/**
 * Uploads an image via the resilient /api/upload endpoint.
 * Bypasses Next.js Server Action body size limits and automatically
 * falls back to Sanity Global CDN if ImageKit credentials are not active.
 */
export async function uploadImageToImageKit(
  base64File: string, 
  fileName: string
): Promise<{
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
  provider?: string;
}> {
  try {
    const formData = new FormData();
    formData.append("file", base64File);
    formData.append("fileName", fileName);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Image upload network error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image. Please check your internet connection.",
    };
  }
}
