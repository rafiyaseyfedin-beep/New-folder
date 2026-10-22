/**
 * Avatar Image Processing Utility
 * Automatically resizes, center-crops, and optimizes user profile photos
 * to a lightweight, crystal-clear 256x256 square JPEG (~15KB - 30KB).
 *
 * This prevents:
 * 1. Supabase Auth payload limit violations ("Request body too large")
 * 2. Browser localStorage QuotaExceeded errors
 * 3. Network lag and database column overflow
 */

export function processAvatarFile(file, size = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file was provided.'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPG, PNG, WebP, GIF).'));
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context not available.');
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Center-crop calculation for a perfect 1:1 circle preview
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;
        const minDimension = Math.min(naturalWidth, naturalHeight);

        const sourceX = (naturalWidth - minDimension) / 2;
        const sourceY = (naturalHeight - minDimension) / 2;

        // Draw cropped image onto square canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          minDimension,
          minDimension,
          0,
          0,
          size,
          size
        );

        // Convert to lightweight JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch (err) {
        // Fallback to FileReader if Canvas operations encounter security/context issues
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image. The file format might be unsupported.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Derives a clean two-letter uppercase initial badge from a user's name
 * e.g. "Elaaf Mohammed" -> "EM", "Refiya" -> "RE"
 */
export function getInitials(name, fallback = 'US') {
  if (!name || typeof name !== 'string') return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
