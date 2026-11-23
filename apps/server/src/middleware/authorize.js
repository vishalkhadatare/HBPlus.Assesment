import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authorization Middleware for Role-Based Access Control (RBAC).
 * Supports case-insensitive role matching (e.g., 'admin' matches 'Admin').
 * 
 * @param {string|string[]} allowedRoles - Role or array of roles permitted to access the route.
 */
export function authorize(allowedRoles = []) {
  const roles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles])
    .map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        errorResponse('User identity is not authenticated.', 'UNAUTHENTICATED')
      );
    }

    if (req.user.isActive === false) {
      return res.status(403).json(
        errorResponse('Access denied. Account is inactive.', 'ACCOUNT_DISABLED')
      );
    }

    const userRole = String(req.user.role || '').toLowerCase();
    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json(
        errorResponse('Forbidden: You do not have permission to perform this action.', 'FORBIDDEN')
      );
    }

    return next();
  };
}

export default authorize;
