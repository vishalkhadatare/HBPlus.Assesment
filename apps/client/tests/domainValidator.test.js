import { isAllowedEmailDomain, extractEmailDomain } from '../src/utils/domainValidator.js';
import { formatAuthError, EXACT_RESTRICTION_MESSAGE } from '../src/utils/errorFormatter.js';

describe('Client Domain Validator & Error Formatter Tests', () => {
  const ALLOWED_DOMAIN = 'hbplus.fit';

  test('isAllowedEmailDomain approves corporate domain employee@hbplus.fit', () => {
    expect(isAllowedEmailDomain('employee@hbplus.fit', ALLOWED_DOMAIN)).toBe(true);
  });

  test('isAllowedEmailDomain normalizes case and approves EMPLOYEE@HBPLUS.FIT', () => {
    expect(isAllowedEmailDomain('EMPLOYEE@HBPLUS.FIT', ALLOWED_DOMAIN)).toBe(true);
  });

  test('isAllowedEmailDomain rejects external provider employee@gmail.com', () => {
    expect(isAllowedEmailDomain('employee@gmail.com', ALLOWED_DOMAIN)).toBe(false);
  });

  test('isAllowedEmailDomain rejects suffix spoofing employee@hbplus.fit.example.com', () => {
    expect(isAllowedEmailDomain('employee@hbplus.fit.example.com', ALLOWED_DOMAIN)).toBe(false);
  });

  test('isAllowedEmailDomain rejects malformed email formats', () => {
    expect(isAllowedEmailDomain('invalid-email', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain('', ALLOWED_DOMAIN)).toBe(false);
    expect(isAllowedEmailDomain(null, ALLOWED_DOMAIN)).toBe(false);
  });

  test('extractEmailDomain extracts normalized domain', () => {
    expect(extractEmailDomain('user@hbplus.fit')).toBe('hbplus.fit');
    expect(extractEmailDomain('Admin@HBPLUS.FIT')).toBe('hbplus.fit');
    expect(extractEmailDomain('invalid')).toBe('');
  });

  test('formatAuthError outputs EXACT required message on DOMAIN_NOT_ALLOWED', () => {
    const error = { code: 'DOMAIN_NOT_ALLOWED', message: 'Rejected' };
    expect(formatAuthError(error)).toBe(EXACT_RESTRICTION_MESSAGE);
    expect(formatAuthError(error)).toBe('Access restricted. Please login using your official domain email.');
  });
});
