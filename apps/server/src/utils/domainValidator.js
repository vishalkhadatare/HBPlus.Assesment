/**
 * Reusable domain validation utility.
 * Enforces strict, normalized, exact-match validation against an allowed email domain.
 */

/**
 * Validates whether an email belongs to the configured allowed domain.
 * 
 * Rules:
 * - Reject missing, non-string, or empty email
 * - Reject malformed email formats
 * - Normalize email and domain (lowercase, trimmed)
 * - Extract domain after the last '@'
 * - Exact equality check against allowed domain (no substring or suffix tricks)
 * 
 * @param {string} email - The email address to validate.
 * @param {string} [configuredDomain] - The allowed domain (defaults to process.env.ALLOWED_EMAIL_DOMAIN or 'hbplus.fit').
 * @returns {boolean} True if email is valid and matches the allowed domain exactly.
 */
export function isAllowedEmailDomain(email, configuredDomain) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return false;
  }

  // Basic RFC 5322 compliant regex check for well-formed email addresses
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }

  const atParts = trimmedEmail.split('@');
  if (atParts.length !== 2) {
    return false;
  }

  const [localPart, domainPart] = atParts;
  if (!localPart || !domainPart) {
    return false;
  }

  // Resolve target allowed domain
  const rawTargetDomain = configuredDomain || process.env.ALLOWED_EMAIL_DOMAIN || 'hbplus.fit';
  if (!rawTargetDomain || typeof rawTargetDomain !== 'string') {
    return false;
  }

  const targetDomain = rawTargetDomain.trim().toLowerCase();
  if (!targetDomain) {
    return false;
  }

  // Exact domain equality match
  return domainPart === targetDomain;
}

/**
 * Normalizes an email string safely.
 * @param {string} email 
 * @returns {string|null}
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return null;
  return email.trim().toLowerCase();
}
