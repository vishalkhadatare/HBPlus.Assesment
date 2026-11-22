import React from 'react';
import { AuthProvider } from './contexts/AuthContext.jsx';
import RootNavigator from './navigation/RootNavigator.jsx';

export function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
