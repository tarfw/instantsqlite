import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const ctx = require.context('./app');

registerRootComponent(function App() {
  return (
    <>
      <StatusBar style="auto" />
      <ExpoRoot context={ctx} />
    </>
  );
});
