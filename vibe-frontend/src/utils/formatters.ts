/**
 * Format numbers into compact telemetry strings (e.g., 1280 -> 1.3K, 50000000 -> 50M)
 */
export function formatCompactNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Truncate long strings with ellipses safely
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}
