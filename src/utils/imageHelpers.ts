/**
 * Handle image load error by setting fallback image
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/default_avatar.jpg';
  e.currentTarget.onerror = null; // Prevent infinite loop
};

/**
 * Get avatar URL with fallback
 */
export const getAvatarUrl = (avatarUrl?: string | null): string => {
  return avatarUrl || '/default_avatar.jpg';
};
