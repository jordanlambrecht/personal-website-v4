// src/components/payload/accessibilityHelpers.ts

/**
 * Calculates the relative luminance of a color.
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * @param {string} hex - The hex color string (e.g., "#RRGGBB").
 * @returns {number} The relative luminance (0 to 1).
 */
export function getRelativeLuminance(hex) {
  hex = hex.replace('#', '')
  if (hex.length !== 6) return 0 // Default to dark if invalid

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const sRGB = [r, g, b].map((val) => {
    const s = val / 255.0
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })

  // WCAG formula for relative luminance
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
}

/**
 * Determines the best contrasting text color (black or white) for a given background hex color.
 * @param {string} hex - The background hex color string.
 * @param {number} [threshold=0.5] - Luminance threshold (0-1). Higher values favor black text more.
 * @returns {string} "#000000" (black) or "#ffffff" (white).
 */
export function getContrastTextColor(hex, threshold = 0.5) {
  const luminance = getRelativeLuminance(hex)
  return luminance > threshold ? '#000000' : '#ffffff'
}
