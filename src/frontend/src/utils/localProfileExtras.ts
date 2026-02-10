export interface ProfileExtras {
  age?: number;
  email?: string;
  country?: string;
}

const STORAGE_KEY_PREFIX = 'edubridge_profile_extras_';

export function storeProfileExtras(principal: string, extras: ProfileExtras): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + principal, JSON.stringify(extras));
  } catch (error) {
    console.warn('Failed to store profile extras:', error);
  }
}

export function getProfileExtras(principal: string): ProfileExtras | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + principal);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to retrieve profile extras:', error);
    return null;
  }
}

export function clearProfileExtras(principal: string): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + principal);
  } catch (error) {
    console.warn('Failed to clear profile extras:', error);
  }
}
