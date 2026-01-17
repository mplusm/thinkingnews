import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useBookmarks } from '../../src/context/BookmarksContext';
import { NewsCard } from '../../src/components/NewsCard';

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const { bookmarks, refreshBookmarks } = useBookmarks();

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshBookmarks();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    countContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    countText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  });

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="bookmark-outline"
        size={64}
        color={colors.textMuted}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No bookmarks yet</Text>
      <Text style={styles.emptyText}>
        Save articles by tapping the bookmark icon on any news card. They'll
        appear here for easy access.
      </Text>
    </View>
  );

  const renderHeader = () => {
    if (bookmarks.length === 0) return null;
    return (
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'}{' '}
          saved
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsCard article={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          bookmarks.length === 0 ? { flex: 1 } : styles.listContent
        }
      />
    </View>
  );
}
