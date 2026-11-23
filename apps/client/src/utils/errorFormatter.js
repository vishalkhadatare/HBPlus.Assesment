/**
 * Formats API and Firebase Authentication errors into accessible user messages.
 */

export const EXACT_RESTRICTION_MESSAGE =
  'Access restricted. Please login using your official domain email.';

export function formatAuthError(error) {
  if (!error) return '';

  // 1. Exact Domain Restriction Check
  if (
    error.code === 'DOMAIN_NOT_ALLOWED' ||
    error.message?.includes('Access restricted') ||
    error.message?.includes('official domain')
  ) {
    return EXACT_RESTRICTION_MESSAGE;
  }

  // 2. Firebase Auth specific codes
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please click "Continue with Google" to try again.';
    case 'auth/cancelled-popup-request':
      return 'Another sign-in request is in progress.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error encountered. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'Your Google account has been disabled. Please contact your administrator.';
    case 'auth/invalid-credential':
    case 'auth/invalid-verification-code':
      return 'Authentication credentials were invalid. Please try again.';
    case 'ACCOUNT_DISABLED':
      return 'Your HBPlus account is deactivated. Please contact your IT administrator.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Your corporate email is not verified by Google Workspace.';
    case 'TOKEN_EXPIRED':
      return 'Your session has expired. Please sign in again.';
    default:
      if (error.message && typeof error.message === 'string') {
        return error.message;
      }
      return 'An unexpected error occurred during authentication. Please retry.';
  }
}

export default formatAuthError;
