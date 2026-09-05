/**
 * Compresses an image file on the client side using HTML5 Canvas.
 * Resizes large images (up to 1400px) and compresses to ~78% JPEG quality,
 * converting heavy 10-15MB phone photos into clean, lightweight ~200-350KB images.
 */
export async function compressImage(file: File): Promise<string> {
  const isHeic = 
    file.name.toLowerCase().endsWith(".heic") || 
    file.name.toLowerCase().endsWith(".heif") ||
    file.type === "image/heic" || 
    file.type === "image/heif";

  return new Promise((resolve, reject) => {
    // If it's not an image MIME type
    if (!file.type.startsWith("image/") && !isHeic) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Unable to read the selected file."));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error("Failed to read file data."));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          const MAX_WIDTH = 1400;
          const MAX_HEIGHT = 1400;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          // Fill white background for transparent images converted to JPEG
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);

          // Draw and resize image onto canvas
          ctx.drawImage(img, 0, 0, width, height);

          // High-efficiency JPEG at 78% quality
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.78);
          resolve(compressedBase64);
        } catch (canvasErr) {
          console.warn("Canvas compression failed, using direct dataUrl:", canvasErr);
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        if (isHeic) {
          reject(
            new Error(
              "Apple HEIC image format detected. Please export or save this photo as a standard JPG or PNG before uploading."
            )
          );
          return;
        }

        if (file.size > 4 * 1024 * 1024) {
          reject(
            new Error(
              `Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB) and could not be compressed in the browser. Please use a JPG or PNG under 4MB.`
            )
          );
          return;
        }

        // Fallback to original reader if smaller image
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => reject(new Error("Failed to read image file from your device."));
    reader.readAsDataURL(file);
  });
}
