// lib/utils.ts - Add this to your existing utils file

/**
 * Converts any image file to proper JPEG format using canvas
 * @param file The original image file
 * @param quality JPEG quality (0-1), default 0.9
 * @returns Promise with the converted JPEG File object
 */
export async function convertToJpeg(
  file: File,
  quality: number = 0.9
): Promise<File> {
  // For debugging
  console.log(
    "Converting file:",
    file.name,
    "type:",
    file.type,
    "size:",
    file.size
  );

  // If already a JPEG and not from conversion tools like WeChat that may have incorrect headers
  if (
    (file.type === "image/jpeg" || file.type === "image/jpg") &&
    !file.name.toLowerCase().includes("wechat")
  ) {
    console.log("File is already JPEG, returning original");
    return file;
  }

  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();

    // Set up the FileReader onload event
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read the file"));
        return;
      }

      // Create an image element
      const img = new Image();

      // Handle image loading errors
      img.onerror = (e) => {
        console.error("Image loading error:", e);
        reject(new Error("Failed to load the image"));
      };

      // When the image is loaded, convert it to JPEG
      img.onload = () => {
        console.log("Image loaded, dimensions:", img.width, "x", img.height);

        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false }); // Disable alpha for proper JPEG conversion

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Fill with white background first (important for transparent PNGs)
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert the canvas content to JPEG data URL
        // Use mimeType with proper parameters
        const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);

        // For debugging
        console.log("JPEG data URL length:", jpegDataUrl.length);

        // Use Blob constructor directly instead of fetch for better control
        const byteString = atob(jpegDataUrl.split(",")[1]);
        const mimeString = jpegDataUrl
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: "image/jpeg" });

        // Create a new File from the Blob
        const convertedFile = new File(
          [blob],
          // Keep the original filename but change extension to .jpg
          file.name.replace(/\.[^/.]+$/, "") + ".jpg",
          { type: "image/jpeg" }
        );

        console.log(
          "Converted file size:",
          convertedFile.size,
          "type:",
          convertedFile.type
        );
        resolve(convertedFile);
      };

      // Set the image source from the FileReader result
      img.src = event.target.result as string;
    };

    // Handle FileReader errors
    reader.onerror = (e) => {
      console.error("FileReader error:", e);
      reject(new Error("Failed to read the file"));
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
}

/**
 * Batch converts multiple image files to JPEG format
 * @param files Array of image files to convert
 * @param quality JPEG quality (0-1), default 0.9
 * @returns Promise with array of converted JPEG File objects
 */
export async function batchConvertToJpeg(
  files: File[],
  quality: number = 0.9
): Promise<File[]> {
  const conversionPromises = files.map((file) => convertToJpeg(file, quality));
  return Promise.all(conversionPromises);
}

/**
 * Special handling for WeChat images which might have format issues
 * @param file The image file to sanitize
 * @returns Promise with the sanitized JPEG File object
 */
export async function sanitizeWeChatImage(file: File): Promise<File> {
  // Always force conversion for WeChat images regardless of extension
  if (
    file.name.toLowerCase().includes("wechat") ||
    file.name.toLowerCase().includes("微信")
  ) {
    console.log("Detected WeChat image, forcing reconversion:", file.name);
    return convertToJpeg(file, 0.95); // Use higher quality for already compressed images
  }
  return file;
}
