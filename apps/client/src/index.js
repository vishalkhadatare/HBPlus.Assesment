if (typeof window !== 'undefined') {
  window.global = window;
}

import { AppRegistry, Platform } from 'react-native';
import App from './App.jsx';

// Register application with React Native AppRegistry
AppRegistry.registerComponent('main', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('app');
  if (rootTag) {
    AppRegistry.runApplication('main', { rootTag });
  }
}

export default App;
