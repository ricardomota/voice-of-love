/**
 * Utility functions for handling avatar URLs
 */

/**
 * Validates if an avatar URL is valid (not a blob URL)
 * @param avatarUrl - The avatar URL to validate
 * @returns true if valid, false if invalid (blob URL or empty)
 */
export const isValidAvatarUrl = (avatarUrl: string | undefined | null): boolean => {
  if (!avatarUrl) return false;
  if (avatarUrl.startsWith('blob:')) return false;
  if (avatarUrl.trim() === '') return false;
  return true;
};

/**
 * Sanitizes avatar URL by removing invalid blob URLs
 * @param avatarUrl - The avatar URL to sanitize
 * @returns cleaned avatar URL or empty string if invalid
 */
export const sanitizeAvatarUrl = (avatarUrl: string | undefined | null): string => {
  if (!isValidAvatarUrl(avatarUrl)) {
    console.warn('avatarUtils: Invalid avatar URL detected and cleaned:', avatarUrl);
    return "";
  }
  return avatarUrl!;
};

/**
 * Validates and sanitizes person data before saving
 * @param personData - The person data to validate
 * @returns sanitized person data
 */
export const sanitizePersonData = <T extends { avatar?: string }>(personData: T): T => {
  return {
    ...personData,
    avatar: sanitizeAvatarUrl(personData.avatar)
  };
};