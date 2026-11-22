import { isAllowedEmailDomain, normalizeEmail } from '../src/utils/domainValidator.js';

describe('Domain Validator Unit Tests', () => {
  const ALLOWED_DOMAIN = 'hbplus.fit';

  test('should allow valid corporate email employee@hbplus.fit', () => {
    expect(isAllowedEmailDomain('employee@hbplus.fit', ALLOWED_DOMAIN)).toBe(true);
  });

  test('should allow uppercase corporate email EMPLOYEE@HBPLUS.FIT after normalization', () => {
    expect(isAllowedEmailDomain('EMPLOYEE@HBPLUS.FIT', ALLOWED_DOMAIN)).toBe(true);
  });

  test('should allow mixed case corporate email Employee.Name@HbPlus.Fit', () => {
    expect(isAllowedEmailDomain('Employee.Name@HbPlus.Fit', ALLOWED_DOMAIN)).toBe(true);
  });

  test('should reject public gmail address employee@gmail.com', () => {
    expect(isAllowedEmailDomain('employee@gmail.com', ALLOWED_DOMAIN)).toBe(false);
  });

  test('should reject public yahoo address user@yahoo.com', () => {
    expect(isAllowedEmailDomain('user@yahoo.com', ALLOWED_DOMAIN)).toBe(false);
  });

  test('should reject subdomain employee@sub.hbplus.fit when only root domain is allowed', () => {
    expect(isAllowedEmailDomain('employee@sub.hbplus.fit', ALLOWED_DOMAIN)).toBe(false);
  });

  test('should reject suffix attack employee@hbplus.fit.example.com', () => {
    expect(isAllowedEmailDomain('employee@hbplus.fit.example.com', ALLOWED_DOMAIN)).toBe(false);
  });

  test('should reject prefix/lookalike domain employee@not-hbplus.fit', () => {
    expect(isAllowedEmailDomain('employee@not-hbplus.fit', ALLOWED_DOMAIN)).toBe(false);
  });

  test('should reject missing, empty, or whitespace email', () => {
    expect(isAllowedEmailDomain('', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain('   ', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain(null, ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain(undefined, ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain(12345, ALLOWED_DOMAIN)).toBe(false);
  });

  test('should reject malformed email formats', () => {
    expect(isAllowedEmailDomain('invalid-email-no-at', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain('user@', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain('@hbplus.fit', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain('user@@hbplus.fit', ALLOWED_DOMAIN)).toBe(false);
  });

  test('normalizeEmail should lowercase and trim safely', () => {
    expect(normalizeEmail('  User@HBPLUS.FIT  ')).toBe('user@hbplus.fit');
    expect(normalizeEmail(null)).toBeNull();
  });
});
