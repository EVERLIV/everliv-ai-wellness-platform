
export class InputSanitizer {
  static sanitizeString(input: string | null | undefined): string {
    if (!input) return '';
    return input.toString().trim().slice(0, 1000); // Limit length to prevent abuse
  }

  static sanitizeEmail(email: string | null | undefined): string {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeString(email).toLowerCase();
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  static isValidUUID(uuid: string | null | undefined): boolean {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static sanitizeNumber(input: number | string | null | undefined): number {
    if (typeof input === 'number' && !isNaN(input)) return input;
    if (typeof input === 'string') {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  static sanitizeInteger(input: number | string | null | undefined): number {
    if (typeof input === 'number' && Number.isInteger(input)) return input;
    if (typeof input === 'string') {
      const parsed = parseInt(input, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
}
