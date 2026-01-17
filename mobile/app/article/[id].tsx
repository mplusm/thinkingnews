import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { formatDistanceToNow, format } from 'date-fns';
import { Article } from '../../src/lib/types';
import { fetchArticle } from '../../src/lib/api';
import { useTheme } from '../../src/context/ThemeContext';
import { useBookmarks } from '../../src/context/BookmarksContext';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { isArticleBookmarked, addBookmark, removeBookmarkById } = useBookmarks();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isBookmarked = article ? isArticleBookmarked(article.id) : false;

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      const data = await fetchArticle(id!);
      setArticle(data);
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOriginal = async () => {
    if (article) {
      await WebBrowser.openBrowserAsync(article.url);
    }
  };

  const handleBookmark = async () => {
    if (!article) return;
    if (isBookmarked) {
      await removeBookmarkById(article.id);
    } else {
      await addBookmark(article);
    }
  };

  const handleShare = async () => {
    if (!article) return;
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
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: colors.error,
      fontSize: 16,
      textAlign: 'center',
    },
    content: {
      padding: 20,
    },
    image: {
      width: '100%',
      height: 200,
      backgroundColor: colors.surface,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sourceBadge: {
      backgroundColor: colors.accent,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    sourceText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    date: {
      color: colors.textMuted,
      fontSize: 13,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
      marginBottom: 16,
    },
    summaryContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    summary: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingVertical: 14,
      gap: 8,
    },
    actionButtonPrimary: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    actionButtonTextPrimary: {
      color: colors.primaryText,
    },
    infoSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    infoLabel: {
      color: colors.textMuted,
      fontSize: 14,
    },
    infoValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Article not found'}</Text>
      </View>
    );
  }

  const formattedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : '';

  const fullDate = article.published_at
    ? format(new Date(article.published_at), 'MMMM d, yyyy h:mm a')
    : '';

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity onPress={handleBookmark}>
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color={isBookmarked ? colors.primary : colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {article.image_url && (
          <Image source={{ uri: article.image_url }} style={styles.image} />
        )}

        <View style={styles.content}>
          <View style={styles.meta}>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>{article.source}</Text>
            </View>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          {article.summary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryLabel}>AI Summary</Text>
              <Text style={styles.summary}>{article.summary}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={handleOpenOriginal}
            >
              <Ionicons
                name="open-outline"
                size={20}
                color={colors.primaryText}
              />
              <Text
                style={[styles.actionButtonText, styles.actionButtonTextPrimary]}
              >
                Read Full Article
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            {fullDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Published</Text>
                <Text style={styles.infoValue}>{fullDate}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Source</Text>
              <Text style={styles.infoValue}>{article.source}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
