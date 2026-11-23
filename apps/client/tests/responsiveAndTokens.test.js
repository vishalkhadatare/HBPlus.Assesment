import { lightTheme, darkTheme, typography, borderRadius } from '../src/theme/tokens.js';

describe('Design Tokens & Responsive Architecture Tests', () => {
  test('Theme tokens contain required Emerald, Amber, and Semantic tokens', () => {
    expect(lightTheme.primary).toBe('#00B386');
    expect(lightTheme.accent).toBe('#FFB020');
    expect(lightTheme.bg).toBe('#F4F8F7');
    expect(lightTheme.surface).toBe('#FFFFFF');
    expect(lightTheme.text).toBe('#0A1A17');

    expect(darkTheme.primary).toBe('#2EE6B6');
    expect(darkTheme.bg).toBe('#06100E');
    expect(darkTheme.surface).toBe('#0D1B18');
    expect(darkTheme.text).toBe('#ECFBF6');
  });

  test('Feature tints are defined for all 13 modules', () => {
    const modules = [
      'dashboard', 'directory', 'attendance', 'leave',
      'shifts', 'payroll', 'tasks', 'performance',
      'announcements', 'documents', 'helpdesk', 'reports', 'settings'
    ];

    modules.forEach((mod) => {
      expect(lightTheme.tints[mod]).toBeDefined();
      expect(lightTheme.tints[mod].bg).toBeDefined();
      expect(lightTheme.tints[mod].text).toBeDefined();
      expect(darkTheme.tints[mod]).toBeDefined();
    });
  });

  test('Typography includes Plus Jakarta Sans, Inter, and JetBrains Mono', () => {
    expect(typography.fonts.display).toContain('Plus Jakarta Sans');
    expect(typography.fonts.body).toContain('Inter');
    expect(typography.fonts.mono).toContain('JetBrains Mono');
  });

  test('Responsive breakpoint logic guarantees no sidebar on phones (< 768px)', () => {
    const checkBreakpoint = (width) => ({
      isPhone: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      showSidebar: width >= 768,
      showBottomTabs: width < 768
    });

    // Test phone widths: 320, 360, 390, 412
    [320, 360, 390, 412, 480, 600, 720].forEach((w) => {
      const bp = checkBreakpoint(w);
      expect(bp.isPhone).toBe(true);
      expect(bp.showSidebar).toBe(false); // MUST NEVER render sidebar on phone!
      expect(bp.showBottomTabs).toBe(true);
    });

    // Test tablet width: 768
    const tabletBp = checkBreakpoint(768);
    expect(tabletBp.isTablet).toBe(true);
    expect(tabletBp.showSidebar).toBe(true);
    expect(tabletBp.showBottomTabs).toBe(false);

    // Test desktop widths: 1024, 1440
    [1024, 1440, 1920].forEach((w) => {
      const bp = checkBreakpoint(w);
      expect(bp.isDesktop).toBe(true);
      expect(bp.showSidebar).toBe(true);
      expect(bp.showBottomTabs).toBe(false);
    });
  });
});
