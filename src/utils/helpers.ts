// /src/lib/utils.ts

import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a human-readable format
 * @param date - Date string to format
 * @param formatString - Format pattern (default: 'MMMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatString = 'MMMM dd, yyyy'): string {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatString)
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength = 150): string {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Creates a slug from a string
 * @param text - Text to convert to slug
 * @returns Slugified string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Converts a string to kebab-case
 * @param string - String to convert
 * @returns Kebab-cased string
 */
export const toKebabCase = (string: string): string =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
