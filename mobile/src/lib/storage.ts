import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from './types';

const BOOKMARKS_KEY = 'thinkingnews_bookmarks';
const THEME_KEY = 'thinkingnews_theme';

export async function getBookmarks(): Promise<Article[]> {
  try {
    const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveBookmark(article: Article): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const exists = bookmarks.some((b) => b.id === article.id);
    if (!exists) {
      bookmarks.unshift(article);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Failed to save bookmark:', error);
  }
}

export async function removeBookmark(articleId: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const filtered = bookmarks.filter((b) => b.id !== articleId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
  }
}

export async function isBookmarked(articleId: string): Promise<boolean> {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some((b) => b.id === articleId);
  } catch {
    return false;
  }
}

export async function getTheme(): Promise<'light' | 'dark' | null> {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme as 'light' | 'dark' | null;
  } catch {
    return null;
  }
}

export async function saveTheme(theme: 'light' | 'dark'): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}
