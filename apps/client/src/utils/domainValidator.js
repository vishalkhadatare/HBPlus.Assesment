/**
 * Client-Side Domain Validation Utility
 * Mirrors backend domain verification for immediate UX feedback.
 */

export function isAllowedEmailDomain(email, configuredDomain = 'hbplus.fit') {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return false;
  }

  const atParts = trimmed.split('@');
  if (atParts.length !== 2) {
    return false;
  }

  const [, domainPart] = atParts;
  const targetDomain = (configuredDomain || 'hbplus.fit').trim().toLowerCase();

  return domainPart === targetDomain;
}

export function extractEmailDomain(email) {
  if (!email || typeof email !== 'string') return '';
  const parts = email.trim().split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : '';
}

export default {
  isAllowedEmailDomain,
  extractEmailDomain
};
