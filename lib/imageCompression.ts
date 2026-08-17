/**
 * Compresses an image file on the client side using HTML5 Canvas.
 * Resizes the image if it exceeds 1600px in either dimension, and compresses to 82% JPEG quality.
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image, resolve with original File Reader base64
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string); // Fallback to raw base64
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export to JPEG with 82% quality to achieve tiny sizes with excellent visual fidelity
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        // Fallback to original reader if Image load fails
        const fallbackReader = new FileReader();
        fallbackReader.onload = (evt) => resolve(evt.target?.result as string);
        fallbackReader.readAsDataURL(file);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
