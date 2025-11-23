/**
 * Format text with newlines for display
 * Use with className="whitespace-pre-line" for proper line breaks
 */
export const formatTextWithNewlines = (text: string): string => {
  if (!text) return '';
  return text;
};

/**
 * Convert \n to <br /> tags for HTML rendering
 */
export const nl2br = (text: string): string => {
  if (!text) return '';
  return text.replace(/\n/g, '<br />');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
