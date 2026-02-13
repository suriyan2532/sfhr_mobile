import { StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // Use local IP for physical device/emulator access to computer's localhost
  // Replace with your actual local IP if different (e.g., from ifconfig)
  const FRONTEND_URL = 'http://172.16.220.132:3000'; 

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <WebView 
          source={{ uri: FRONTEND_URL }} 
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => <></>} // Optional: Add a loading indicator
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  webview: {
    flex: 1
  }
});
