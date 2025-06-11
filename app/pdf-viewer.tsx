import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface PDFViewerParams {
  uri: string;
}

const PDFViewerScreen: React.FC = () => {
  const { uri } = useLocalSearchParams<PDFViewerParams>();

  // Create the proper file URL for the WebView
  const fileUrl = Platform.select({
    android: `file://${uri}`,
    ios: uri,
    default: uri,
  });

  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'PDF Viewer',
          headerShown: true,
        }} 
      />
      <ThemedView style={styles.webviewContainer}>
        <WebView
          source={{ uri: fileUrl }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={handleError}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ThemedText>Loading PDF...</ThemedText>
            </View>
          )}
          startInLoadingState={true}
        />
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PDFViewerScreen; 