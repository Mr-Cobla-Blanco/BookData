import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface Book {
  id: string;
  name: string;
  progress: number; // percent
  pages: number;
}

const mockBooks: Book[] = [
  { id: '1', name: 'Atomic Habits', progress: 75, pages: 320 },
  { id: '2', name: 'Deep Work', progress: 40, pages: 280 },
  { id: '3', name: 'The Pragmatic Programmer', progress: 100, pages: 352 },
];

const LibraryScreen: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Library</ThemedText>
      <FlatList
        data={mockBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            <ThemedText>Progress: {item.progress}%</ThemedText>
            <ThemedText>Pages: {item.pages}</ThemedText>
          </View>
        )}
        contentContainerStyle={{ gap: 16, paddingTop: 16 }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  bookItem: {
    backgroundColor: '#0a0050',
    borderRadius: 12,
    padding: 16,
  },
});

export default LibraryScreen; 