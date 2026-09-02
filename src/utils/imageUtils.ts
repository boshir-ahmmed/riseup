/**
 * Client-side image compression utility to prevent browser localStorage quota exhaustion
 * and memory crashes when users upload photos or camera shots.
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Resizes and compresses an image File or Data URL to a lightweight base64 string.
 * Reduces 5MB-10MB camera/cover photos down to ~50KB-150KB.
 */
export async function compressImage(
  source: File | string,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.75,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    // If SVG, don't re-compress on canvas (keeps vector clarity)
    if (typeof source !== 'string' && source.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(source);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const bestRatio = Math.min(widthRatio, heightRatio);
          width = Math.round(width * bestRatio);
          height = Math.round(height * bestRatio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data if canvas is unsupported
          if (typeof source === 'string') {
            resolve(source);
          } else {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(source);
          }
          return;
        }

        // Smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill background with white for transparent images converted to JPEG
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        if (typeof source === 'string') {
          resolve(source);
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(source);
        }
      }
    };

    img.onerror = () => {
      if (typeof source === 'string') {
        resolve(source);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(source);
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}
