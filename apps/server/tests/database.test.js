import request from 'supertest';
import app from '../src/app.js';
import { UserService } from '../src/services/userService.js';

describe('Database User Storage & Profile Persistence Tests', () => {
  beforeEach(() => {
    UserService._resetInMemory();
  });

  test('Database successfully provisions and stores new user profile', async () => {
    const newUser = {
      uid: 'emp-db-001',
      email: 'alex.morgan@hbplus.fit',
      name: 'Alex Morgan',
      phone: '+1 555-0199',
      countryCode: '+1'
    };

    const stored = await UserService.provisionOrUpdateUser(newUser);

    expect(stored).toBeDefined();
    expect(stored.uid).toBe('emp-db-001');
    expect(stored.email).toBe('alex.morgan@hbplus.fit');
    expect(stored.displayName).toBe('Alex Morgan');
    expect(stored.phone).toBe('+1 555-0199');
    expect(stored.role).toBe('User');
    expect(stored.isActive).toBe(true);
    expect(stored.createdAt).toBeDefined();
    expect(stored.lastLoginAt).toBeDefined();

    // Verify retrieval from database
    const retrieved = await UserService.getUserProfile('emp-db-001');
    expect(retrieved).not.toBeNull();
    expect(retrieved.email).toBe('alex.morgan@hbplus.fit');
    expect(retrieved.displayName).toBe('Alex Morgan');
  });

  test('Database updates existing user profile with safe profile modifications', async () => {
    await UserService.provisionOrUpdateUser({
      uid: 'emp-db-002',
      email: 'rachel.adams@hbplus.fit',
      name: 'Rachel Adams'
    });

    const updated = await UserService.updateSafeProfile('emp-db-002', {
      displayName: 'Rachel Adams, Senior Lead',
      department: 'Engineering & Innovation',
      designation: 'Senior Staff Engineer',
      phone: '+91 9876543210',
      bio: 'Cloud architecture and cross-platform mobile security specialist.',
      emergencyContact: '+91 9999888877'
    });

    expect(updated).toBeDefined();
    expect(updated.displayName).toBe('Rachel Adams, Senior Lead');
    expect(updated.department).toBe('Engineering & Innovation');
    expect(updated.designation).toBe('Senior Staff Engineer');
    expect(updated.phone).toBe('+91 9876543210');
    expect(updated.emergencyContact).toBe('+91 9999888877');

    // Confirm database state has new data
    const freshFetch = await UserService.getUserProfile('emp-db-002');
    expect(freshFetch.department).toBe('Engineering & Innovation');
    expect(freshFetch.designation).toBe('Senior Staff Engineer');
  });

  test('Database correctly provisions admin account based on ADMIN_EMAILS configuration', async () => {
    const adminUser = {
      uid: 'admin-db-001',
      email: 'admin@hbplus.fit',
      name: 'Master Administrator'
    };

    const profile = await UserService.provisionOrUpdateUser(adminUser);
    expect(profile.role).toBe('Admin');
    expect(profile.isActive).toBe(true);
  });

  test('POST /api/auth/reset-password sends reset instructions for allowed domain', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'employee@hbplus.fit' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Password reset instructions sent');
  });

  test('POST /api/auth/reset-password rejects unauthorized domains with strict error', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'intruder@gmail.com' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Access restricted. Please login using your official domain email.');
  });
});
