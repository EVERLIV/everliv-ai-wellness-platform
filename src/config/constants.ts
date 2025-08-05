
// Configuration constants
export const BASE_URL = import.meta.env.PROD 
  ? 'https://everliv.online' 
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080');

export const getResetPasswordUrl = () => `${BASE_URL}/reset-password`;
export const getAuthConfirmUrl = () => `${BASE_URL}/auth/confirm`;
