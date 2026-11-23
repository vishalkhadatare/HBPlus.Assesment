/**
 * Domain validation utility (Single Source of Truth)
 * Enforces strict, normalized, exact-match validation against an allowed email domain.
 */

export const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'hbplus.fit';

/**
 * Pure function: Validates whether an email belongs to the configured allowed domain.
 * 
 * Rules:
 * - Reject missing, non-string, or empty email
 * - Exactly one '@', with at least 1 character before it
 * - Reject non-ASCII / Unicode look-alike spoofing characters
 * - Reject quotes, subdomains, evil suffixes or prefixes
 * - EXACT equality match on domain portion (case-insensitive, trimmed)
 * 
 * @param {string} email - The email address to validate.
 * @param {string} [domain=ALLOWED_DOMAIN] - The target domain.
 * @returns {boolean} True if email is strictly allowed.
 */
export function isAllowedEmail(email, domain = ALLOWED_DOMAIN) {
  if (!email || typeof email !== 'string') return false;

  const e = email.trim().toLowerCase();
  if (!e) return false;

  // Reject non-ASCII characters (blocks Cyrillic, Greek, or Unicode look-alike domain attacks)
  if (/[^\x20-\x7E]/.test(e)) return false;

  // Reject quotes in local part or domain attacks e.g. "a@hbplus.fit"@evil.com
  if (e.includes('"')) return false;

  const at = e.lastIndexOf('@');
  // Must have exactly one '@' and something before it (at >= 1)
  if (at < 1 || at !== e.indexOf('@')) return false;

  // Exactly match the domain portion
  const targetDomain = (domain || ALLOWED_DOMAIN).toLowerCase().trim();
  return e.slice(at + 1) === targetDomain;
}

// Backwards compatibility alias
export const isAllowedEmailDomain = isAllowedEmail;

export default isAllowedEmail;
