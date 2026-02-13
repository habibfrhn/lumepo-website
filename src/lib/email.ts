const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);

  if (normalized.length < 3 || normalized.length > 254) {
    return false;
  }

  const atIndex = normalized.indexOf("@");
  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return false;
  }

  const [localPart, domainPart] = normalized.split("@");
  if (!localPart || !domainPart) {
    return false;
  }

  if (localPart.length > 64 || domainPart.length > 253) {
    return false;
  }

  return EMAIL_REGEX.test(normalized);
}
