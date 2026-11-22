import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

/**
 * Custom hook to access authentication context throughout the application.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
