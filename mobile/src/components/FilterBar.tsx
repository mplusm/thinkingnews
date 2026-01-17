import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Source, TimeFilter } from '../lib/types';
import { fetchSources } from '../lib/api';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  selectedTime: TimeFilter;
  onTimeChange: (time: TimeFilter) => void;
  onClearFilters: () => void;
}

const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedSource,
  onSourceChange,
  selectedTime,
  onTimeChange,
  onClearFilters,
}: FilterBarProps) {
  const { colors } = useTheme();
  const [sources, setSources] = useState<Source[]>([]);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    const data = await fetchSources();
    setSources(data);
  };

  const hasActiveFilters = searchQuery || selectedSource || selectedTime !== 'all';

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
    },
    clearButton: {
      padding: 4,
    },
    filtersRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
    },
    filterButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    filterButtonTextActive: {
      color: colors.primaryText,
      fontWeight: '600',
    },
    clearFiltersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 4,
    },
    clearFiltersText: {
      color: colors.error,
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 16,
      paddingBottom: 32,
      maxHeight: '60%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
    modalOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    modalOptionText: {
      color: colors.text,
      fontSize: 16,
    },
    modalOptionTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  const selectedTimeLabel =
    TIME_OPTIONS.find((t) => t.value === selectedTime)?.label || 'All Time';

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search news..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onSearchChange('')}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedSource && styles.filterButtonActive,
          ]}
          onPress={() => setShowSourceModal(true)}
        >
          <Ionicons
            name="newspaper-outline"
            size={16}
            color={selectedSource ? colors.primaryText : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterButtonText,
              selectedSource && styles.filterButtonTextActive,
            ]}
          >
            {selectedSource || 'All Sources'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={selectedSource ? colors.primaryText : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedTime !== 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setShowTimeModal(true)}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={selectedTime !== 'all' ? colors.primaryText : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterButtonText,
              selectedTime !== 'all' && styles.filterButtonTextActive,
            ]}
          >
            {selectedTimeLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={selectedTime !== 'all' ? colors.primaryText : colors.textSecondary}
          />
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={onClearFilters}
          >
            <Ionicons name="close" size={16} color={colors.error} />
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Source Modal */}
      <Modal
        visible={showSourceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSourceModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source</Text>
              <TouchableOpacity onPress={() => setShowSourceModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  onSourceChange('');
                  setShowSourceModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    !selectedSource && styles.modalOptionTextActive,
                  ]}
                >
                  All Sources
                </Text>
                {!selectedSource && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
              {sources.map((source) => (
                <TouchableOpacity
                  key={source.name}
                  style={styles.modalOption}
                  onPress={() => {
                    onSourceChange(source.name);
                    setShowSourceModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedSource === source.name &&
                        styles.modalOptionTextActive,
                    ]}
                  >
                    {source.name}
                  </Text>
                  {selectedSource === source.name && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Time Modal */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTimeModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Period</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalOption}
                  onPress={() => {
                    onTimeChange(option.value);
                    setShowTimeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedTime === option.value &&
                        styles.modalOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedTime === option.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
