import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function UploadScreen() {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      // Navigate to the PDF viewer with the selected file
      router.push({
        pathname: "/pdf-viewer",
        params: { uri: file.uri },
      });
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <IconSymbol name="add.box" size={64} color="#00e6c3" />
        <ThemedText style={styles.uploadText}>Select PDF to Upload</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#0a0050",
    width: "100%",
    maxWidth: 300,
  },
  uploadText: {
    marginTop: 16,
    fontSize: 18,
    color: "#00e6c3",
  },
});