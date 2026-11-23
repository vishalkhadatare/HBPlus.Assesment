import { isAllowedEmail, ALLOWED_DOMAIN } from '../src/utils/domainValidator.js';

describe('Strict Domain Validation Unit Tests (Section 2.2 Server)', () => {
  test('Valid official domain email passes', () => {
    expect(isAllowedEmail('a@hbplus.fit')).toBe(true);
  });

  test('Case-insensitive validation passes', () => {
    expect(isAllowedEmail('A@HBPLUS.FIT')).toBe(true);
    expect(isAllowedEmail('Employee@HBPlus.Fit')).toBe(true);
  });

  test('Whitespace trimmed validation passes', () => {
    expect(isAllowedEmail(' a@hbplus.fit ')).toBe(true);
  });

  test('Personal Gmail is strictly rejected', () => {
    expect(isAllowedEmail('a@gmail.com')).toBe(false);
  });

  test('Prefix attack domain is rejected', () => {
    expect(isAllowedEmail('a@evilhbplus.fit')).toBe(false);
  });

  test('Suffix attack domain is rejected', () => {
    expect(isAllowedEmail('a@hbplus.fit.evil.com')).toBe(false);
  });

  test('Subdomain is rejected', () => {
    expect(isAllowedEmail('a@sub.hbplus.fit')).toBe(false);
  });

  test('Multiple @ symbols are rejected', () => {
    expect(isAllowedEmail('a@@hbplus.fit')).toBe(false);
  });

  test('Quoted email attack string is rejected', () => {
    expect(isAllowedEmail('"a@hbplus.fit"@evil.com')).toBe(false);
  });

  test('Empty, null, non-string, or no @ emails are rejected', () => {
    expect(isAllowedEmail('')).toBe(false);
    expect(isAllowedEmail(null)).toBe(false);
    expect(isAllowedEmail('hbplus.fit')).toBe(false);
    expect(isAllowedEmail('@hbplus.fit')).toBe(false);
  });

  test('Unicode look-alike domain spoofing is strictly rejected', () => {
    expect(isAllowedEmail('user@hbplus.f\u0456t')).toBe(false);
  });
});
