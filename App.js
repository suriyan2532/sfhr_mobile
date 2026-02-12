import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
        <AuthProvider>
            <PaperProvider>
                <AppNavigator />
            </PaperProvider>
        </AuthProvider>
    </SafeAreaProvider>
  );
}
