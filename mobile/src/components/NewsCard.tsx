import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../lib/types';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../context/BookmarksContext';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { isArticleBookmarked, addBookmark, removeBookmarkById } = useBookmarks();
  const isBookmarked = isArticleBookmarked(article.id);

  const formattedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : '';

  const handlePress = () => {
    router.push(`/article/${article.id}`);
  };

  const handleOpenOriginal = async () => {
    await WebBrowser.openBrowserAsync(article.url);
  };

  const handleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmarkById(article.id);
    } else {
      await addBookmark(article);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\nRead more: ${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    sourceBadge: {
      backgroundColor: colors.accent,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    sourceText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '600',
    },
    date: {
      color: colors.textMuted,
      fontSize: 12,
    },
    title: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 24,
      marginBottom: 8,
    },
    summary: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 12,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 16,
    },
    actionButton: {
      padding: 4,
    },
    readOriginal: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    readOriginalText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{article.source}</Text>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <Text style={styles.title} numberOfLines={3}>
        {article.title}
      </Text>

      {article.summary && (
        <Text style={styles.summary} numberOfLines={3}>
          {article.summary}
        </Text>
      )}

      <View style={styles.actions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBookmark}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons
              name="share-outline"
              size={22}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.readOriginal} onPress={handleOpenOriginal}>
          <Text style={styles.readOriginalText}>Read original</Text>
          <Ionicons
            name="open-outline"
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
