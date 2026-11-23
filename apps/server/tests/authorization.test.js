import request from 'supertest';
import app from '../src/app.js';
import { UserService } from '../src/services/userService.js';

function createTestToken(payload) {
  return 'mock-token-' + Buffer.from(JSON.stringify(payload)).toString('base64');
}

describe('Protected Routes and Role-Based Authorization Tests', () => {
  beforeEach(() => {
    UserService._resetInMemory();
  });

  describe('GET /api/dashboard', () => {
    test('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('MISSING_TOKEN');
    });

    test('should grant access to authorized corporate user', async () => {
      const token = createTestToken({
        uid: 'user-emp-10',
        email: 'employee@hbplus.fit',
        name: 'Corp Employee',
        email_verified: true
      });

      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.portalOverview.organizationName).toContain('HBPlus');
      expect(res.body.data.metrics).toBeDefined();
    });
  });

  describe('GET /api/users/me', () => {
    test('should retrieve current user profile from directory', async () => {
      const token = createTestToken({
        uid: 'user-profile-test',
        email: 'staff@hbplus.fit',
        name: 'Staff Member',
        email_verified: true
      });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.uid).toBe('user-profile-test');
      expect(res.body.data.role).toBe('User');
      expect(res.body.data.isActive).toBe(true);
    });
  });

  describe('Role-Based Access Control: GET /api/admin/users', () => {
    test('should forbid ordinary employee (role: user) from accessing admin users directory', async () => {
      const token = createTestToken({
        uid: 'regular-user-id',
        email: 'staff@hbplus.fit',
        name: 'Regular Staff',
        email_verified: true
      });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    test('should allow authorized admin account to access admin users directory', async () => {
      // admin@hbplus.fit is automatically provisioned as admin per ADMIN_EMAILS configuration
      const token = createTestToken({
        uid: 'admin-user-id',
        email: 'admin@hbplus.fit',
        name: 'Corporate Admin',
        email_verified: true
      });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.users).toBeDefined();
    });
  });

  describe('Role Manipulation Protection', () => {
    test('user cannot escalate privileges through PATCH /api/users/me', async () => {
      const token = createTestToken({
        uid: 'hacker-attempt-id',
        email: 'attacker@hbplus.fit',
        name: 'Wannabe Admin',
        email_verified: true
      });

      // Attempt to overwrite role and isActive
      const patchRes = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'admin',
          isActive: false,
          displayName: 'Updated Name'
        });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.displayName).toBe('Updated Name');
      // Role must remain strictly 'User'
      expect(patchRes.body.data.role).toBe('User');

      // Verify that admin route is STILL forbidden
      const adminRes = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(adminRes.status).toBe(403);
      expect(adminRes.body.code).toBe('FORBIDDEN');
    });
  });
});
