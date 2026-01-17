import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Article, TimeFilter } from '../../src/lib/types';
import { fetchNews } from '../../src/lib/api';
import { useTheme } from '../../src/context/ThemeContext';
import { NewsCard } from '../../src/components/NewsCard';
import { FilterBar } from '../../src/components/FilterBar';
import { TrendingSection } from '../../src/components/TrendingSection';

export default function FeedScreen() {
  const { colors } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeFilter>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasNext(true);
    loadNews(1, true);
  }, [debouncedSearch, selectedSource, selectedTime]);

  const loadNews = async (pageNum: number, isReset: boolean = false) => {
    if (isReset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const data = await fetchNews({
        page: pageNum,
        limit: 20,
        q: debouncedSearch || undefined,
        source: selectedSource || undefined,
        time: selectedTime,
      });

      if (isReset) {
        setArticles(data.articles);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
      }
      setHasNext(data.has_next);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNext && !loading) {
      loadNews(page + 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadNews(1, true);
    setRefreshing(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSource('');
    setSelectedTime('all');
  };

  const hasActiveFilters = searchQuery || selectedSource || selectedTime !== 'all';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
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
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
  });

  const renderHeader = () => (
    <>
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        selectedTime={selectedTime}
        onTimeChange={setSelectedTime}
        onClearFilters={handleClearFilters}
      />
      {!hasActiveFilters && <TrendingSection />}
    </>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {hasActiveFilters
            ? 'No articles found matching your filters.'
            : 'No articles available.'}
        </Text>
      </View>
    );
  };

  if (loading && articles.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error && articles.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsCard article={item} />}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}
