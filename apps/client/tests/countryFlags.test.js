import { ALL_COUNTRIES, TOP_COUNTRIES, DEFAULT_COUNTRY } from '../src/constants/countries.js';

describe('Global Country Flags & Codes Suite', () => {
  test('DEFAULT_COUNTRY is India (+91) with ISO IN', () => {
    expect(DEFAULT_COUNTRY).toBeDefined();
    expect(DEFAULT_COUNTRY.iso).toBe('IN');
    expect(DEFAULT_COUNTRY.code).toBe('+91');
    expect(DEFAULT_COUNTRY.name).toBe('India');
  });

  test('TOP_COUNTRIES contains major enterprise destinations', () => {
    expect(TOP_COUNTRIES.length).toBeGreaterThanOrEqual(10);
    const topIsos = TOP_COUNTRIES.map((c) => c.iso);
    expect(topIsos).toContain('IN');
    expect(topIsos).toContain('US');
    expect(topIsos).toContain('GB');
    expect(topIsos).toContain('AE');
    expect(topIsos).toContain('SG');
  });

  test('ALL_COUNTRIES contains comprehensive country dataset with valid ISO, code, and name', () => {
    expect(ALL_COUNTRIES.length).toBeGreaterThan(150);

    ALL_COUNTRIES.forEach((c) => {
      expect(c.iso).toMatch(/^[A-Z]{2}$/);
      expect(c.code).toMatch(/^\+[0-9-]+$/);
      expect(typeof c.name).toBe('string');
      expect(c.name.length).toBeGreaterThan(0);
    });
  });

  test('Countries can be searched by name, dial code, or ISO', () => {
    const searchByName = ALL_COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes('emirates')
    );
    expect(searchByName.length).toBe(1);
    expect(searchByName[0].iso).toBe('AE');

    const searchByCode = ALL_COUNTRIES.filter((c) => c.code === '+971');
    expect(searchByCode.length).toBe(1);
    expect(searchByCode[0].name).toBe('United Arab Emirates');

    const searchByIso = ALL_COUNTRIES.filter((c) => c.iso === 'US');
    expect(searchByIso.length).toBe(1);
    expect(searchByIso[0].code).toBe('+1');
  });
});
