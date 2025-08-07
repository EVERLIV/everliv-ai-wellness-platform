
// Configuration constants
export const BASE_URL = import.meta.env.PROD 
  ? 'https://everliv.online' 
  : window.location.origin;

export const getResetPasswordUrl = () => `${BASE_URL}/reset-password`;
export const getAuthConfirmUrl = () => `${BASE_URL}/auth/confirm`;
