import { isAllowedEmailDomain } from '../utils/domainValidator.js';
import config from '../config/environment.js';

export class AuthService {
  /**
   * Verifies and shapes the authorized profile payload.
   * @param {object} user - Populated by authentication middleware
   * @returns {object}
   */
  static getAuthorizedProfile(user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      role: user.role,
      isActive: user.isActive,
      domain: config.ALLOWED_EMAIL_DOMAIN,
      authorizedAt: new Date().toISOString()
    };
  }
}

export default AuthService;
