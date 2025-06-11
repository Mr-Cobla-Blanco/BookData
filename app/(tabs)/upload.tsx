import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const UploadScreen: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.assets && result.assets[0]) {
      setFileName(result.assets[0].name);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <ThemedText type="defaultSemiBold">Upload PDF</ThemedText>
      </TouchableOpacity>
      {fileName && <ThemedText>Selected: {fileName}</ThemedText>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  button: {
    backgroundColor: '#00e6c3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default UploadScreen; 