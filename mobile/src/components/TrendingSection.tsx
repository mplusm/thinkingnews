import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Article } from '../lib/types';
import { fetchTrending } from '../lib/api';
import { useTheme } from '../context/ThemeContext';

export function TrendingSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      const data = await fetchTrending(5);
      setArticles(data.articles);
    } catch (error) {
      console.error('Failed to load trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    headerText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    rank: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '700',
      width: 24,
    },
    content: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    source: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 4,
    },
    chevron: {
      marginLeft: 8,
      alignSelf: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="trending-up" size={22} color={colors.primary} />
          <Text style={styles.headerText}>Trending</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={22} color={colors.primary} />
        <Text style={styles.headerText}>Trending</Text>
      </View>
      {articles.map((article, index) => (
        <TouchableOpacity
          key={article.id}
          style={[styles.item, index === articles.length - 1 && styles.lastItem]}
          onPress={() => handlePress(article.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.rank}>{index + 1}</Text>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.source}>{article.source}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textMuted}
            style={styles.chevron}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
