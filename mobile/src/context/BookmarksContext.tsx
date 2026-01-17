import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article } from '../lib/types';
import {
  getBookmarks,
  saveBookmark,
  removeBookmark,
  isBookmarked,
} from '../lib/storage';

interface BookmarksContextType {
  bookmarks: Article[];
  bookmarkedIds: Set<string>;
  addBookmark: (article: Article) => Promise<void>;
  removeBookmarkById: (articleId: string) => Promise<void>;
  isArticleBookmarked: (articleId: string) => boolean;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(
  undefined
);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const refreshBookmarks = async () => {
    const savedBookmarks = await getBookmarks();
    setBookmarks(savedBookmarks);
    setBookmarkedIds(new Set(savedBookmarks.map((b) => b.id)));
  };

  const addBookmark = async (article: Article) => {
    await saveBookmark(article);
    await refreshBookmarks();
  };

  const removeBookmarkById = async (articleId: string) => {
    await removeBookmark(articleId);
    await refreshBookmarks();
  };

  const isArticleBookmarked = (articleId: string) => {
    return bookmarkedIds.has(articleId);
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        bookmarkedIds,
        addBookmark,
        removeBookmarkById,
        isArticleBookmarked,
        refreshBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
