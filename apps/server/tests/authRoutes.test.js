import request from 'supertest';
import app from '../src/app.js';
import { UserService } from '../src/services/userService.js';

// Helper to generate test mock tokens
function createTestToken(payload) {
  return 'mock-token-' + Buffer.from(JSON.stringify(payload)).toString('base64');
}

describe('Authentication & Domain Verification API Tests', () => {
  beforeEach(() => {
    UserService._resetInMemory();
  });

  describe('GET /api/health', () => {
    test('should return 200 and operational status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('UP');
      expect(res.body.data.enforcedDomain).toBe('hbplus.fit');
    });
  });

  describe('POST /api/auth/verify', () => {
    test('should reject request without Authorization header', async () => {
      const res = await request(app).post('/api/auth/verify');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('MISSING_TOKEN');
    });

    test('should reject non-Bearer scheme', async () => {
      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Basic 123456');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INVALID_AUTH_SCHEME');
    });

    test('should reject unparseable/invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token-string');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INVALID_TOKEN');
    });

    test('should reject token with missing email', async () => {
      const token = createTestToken({
        uid: 'user-without-email',
        email_verified: true
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('MISSING_EMAIL');
    });

    test('should reject unverified email address', async () => {
      const token = createTestToken({
        uid: 'unverified-user',
        email: 'employee@hbplus.fit',
        email_verified: false
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('EMAIL_NOT_VERIFIED');
    });

    test('should reject unauthorized domain (employee@gmail.com) with exact specified message', async () => {
      const token = createTestToken({
        uid: 'gmail-user',
        email: 'employee@gmail.com',
        name: 'Gmail User',
        email_verified: true
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('DOMAIN_NOT_ALLOWED');
      expect(res.body.message).toBe('Access restricted. Please login using your official domain email.');
    });

    test('should reject Gmail users even when authenticated via Google provider', async () => {
      const token = createTestToken({
        uid: 'gmail-google-user',
        email: 'khadatarevishal@gmail.com',
        name: 'Gmail Google User',
        email_verified: true,
        firebase: { sign_in_provider: 'google.com' }
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('DOMAIN_NOT_ALLOWED');
      expect(res.body.message).toBe('Access restricted. Please login using your official domain email.');
    });

    test('should reject unauthorized suffix domain (employee@hbplus.fit.example.com)', async () => {
      const token = createTestToken({
        uid: 'phishing-user',
        email: 'employee@hbplus.fit.example.com',
        name: 'Attacker',
        email_verified: true
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('DOMAIN_NOT_ALLOWED');
      expect(res.body.message).toBe('Access restricted. Please login using your official domain email.');
    });

    test('should successfully authorize employee with @hbplus.fit domain', async () => {
      const token = createTestToken({
        uid: 'hbplus-employee-1',
        email: 'employee@hbplus.fit',
        name: 'John Doe',
        picture: 'https://example.com/avatar.jpg',
        email_verified: true
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Authentication successful');
      expect(res.body.data.email).toBe('employee@hbplus.fit');
      expect(res.body.data.role.toLowerCase()).toBe('user');
      expect(res.body.data.displayName).toBe('John Doe');
    });

    test('should normalize uppercase domain EMPLOYEE@HBPLUS.FIT and authorize', async () => {
      const token = createTestToken({
        uid: 'hbplus-employee-2',
        email: 'EMPLOYEE@HBPLUS.FIT',
        name: 'Jane Doe',
        email_verified: true
      });

      const res = await request(app)
        .post('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('employee@hbplus.fit');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should return current authenticated profile', async () => {
      const token = createTestToken({
        uid: 'hbplus-employee-3',
        email: 'employee@hbplus.fit',
        name: 'Alice Staff',
        email_verified: true
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.uid).toBe('hbplus-employee-3');
      expect(res.body.data.email).toBe('employee@hbplus.fit');
    });
  });
});
