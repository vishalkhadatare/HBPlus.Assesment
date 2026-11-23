/**
 * Client-Side Domain Validation Utility
 * Enforces strict, normalized check against the authorized @hbplus.fit company domain.
 */

export function isAllowedEmailDomain(email, configuredDomain = 'hbplus.fit') {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return false;
  }

  // Strict check that the email ends with @<configuredDomain>
  const targetDomain = (configuredDomain || 'hbplus.fit').trim().toLowerCase();
  const expectedSuffix = `@${targetDomain}`;

  if (!trimmed.endsWith(expectedSuffix)) {
    return false;
  }

  // Disallow lookalikes like user@not-hbplus.fit or user@hbplus.fit.example.com
  const atParts = trimmed.split('@');
  if (atParts.length !== 2) {
    return false;
  }

  const [, domainPart] = atParts;
  return domainPart === targetDomain;
}

export function extractEmailDomain(email) {
  if (!email || typeof email !== 'string') return '';
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

export default {
  isAllowedEmailDomain,
  extractEmailDomain
};
