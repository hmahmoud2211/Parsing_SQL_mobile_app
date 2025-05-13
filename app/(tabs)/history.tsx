import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import Screen from '@/components/Screen';
import HeaderBar from '@/components/HeaderBar';
import HistoryItem from '@/components/HistoryItem';
import { useHistoryStore, HistoryEntry } from '@/store/historyStore';
import { useTheme } from '@/contexts/ThemeContext';
import { Trash } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { history, toggleFavorite, removeEntry, clearHistory } = useHistoryStore();

  const handlePress = (query: string) => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Navigate to the query tab and set the query
    navigation.navigate('index' as never);
    // You'd ideally set the query text in the store instead, but we're using local state in this MVP
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDelete = (id: string) => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // On web, use confirm, on mobile use Alert
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this query?')) {
        removeEntry(id);
      }
    } else {
      Alert.alert(
        'Delete Query',
        'Are you sure you want to delete this query?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => removeEntry(id) }
        ]
      );
    }
  };

  const handleClearAll = () => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    // On web, use confirm, on mobile use Alert
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to clear all history?')) {
        clearHistory();
      }
    } else {
      Alert.alert(
        'Clear History',
        'Are you sure you want to clear all history?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: clearHistory }
        ]
      );
    }
  };

  const renderEmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.subtext }]}>
        No query history yet
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
        Run SQL queries to see them here
      </Text>
    </View>
  );

  return (
    <Screen paddingHorizontal={0} paddingVertical={0}>
      <HeaderBar 
        title="History" 
        rightComponent={
          history.length > 0 ? (
            <Pressable 
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Trash size={20} color={colors.error} />
              <Text style={[styles.clearButtonText, { color: colors.error }]}>
                Clear
              </Text>
            </Pressable>
          ) : null
        }
      />
      
      <FlatList
        data={history}
        renderItem={({ item }: { item: HistoryEntry }) => (
          <HistoryItem
            entry={item}
            onPress={handlePress}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyHistory}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearButtonText: {
    marginLeft: 4,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});