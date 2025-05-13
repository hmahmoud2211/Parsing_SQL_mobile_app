import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Star, Copy, Trash2 } from 'lucide-react-native';
import { HistoryEntry } from '@/store/historyStore';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type HistoryItemProps = {
  entry: HistoryEntry;
  onPress: (query: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HistoryItem({
  entry,
  onPress,
  onToggleFavorite,
  onDelete,
}: HistoryItemProps) {
  const { colors } = useTheme();
  
  // Format date
  const formattedDate = new Date(entry.timestamp).toLocaleString();
  
  // Truncate query for display
  const displayQuery = entry.query.length > 100
    ? entry.query.substring(0, 100) + '...'
    : entry.query;
  
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
    >
      <Pressable
        style={styles.content}
        onPress={() => onPress(entry.query)}
        android_ripple={{ color: colors.border }}
      >
        <View style={styles.header}>
          <Text style={[styles.timestamp, { color: colors.subtext }]}>
            {formattedDate}
          </Text>
          
          <View style={styles.badges}>
            <View style={[
              styles.badge,
              { 
                backgroundColor: entry.result.is_valid ? colors.success : colors.error,
              }
            ]}>
              <Text style={styles.badgeText}>
                {entry.result.is_valid ? 'Valid' : 'Invalid'}
              </Text>
            </View>
            
            <View style={[
              styles.badge,
              { backgroundColor: colors.secondary }
            ]}>
              <Text style={styles.badgeText}>
                {entry.result.statement_type}
              </Text>
            </View>
          </View>
        </View>
        
        <Text 
          style={[styles.query, { color: colors.text }]}
          numberOfLines={2}
        >
          {displayQuery}
        </Text>
      </Pressable>
      
      <View style={styles.actions}>
        <Pressable 
          style={styles.actionButton}
          onPress={() => onToggleFavorite(entry.id)}
        >
          <Star 
            size={20} 
            color={entry.isFavorite ? colors.warning : colors.subtext} 
            fill={entry.isFavorite ? colors.warning : 'none'}
          />
        </Pressable>
        
        <Pressable 
          style={styles.actionButton}
          onPress={() => onPress(entry.query)}
        >
          <Copy size={20} color={colors.primary} />
        </Pressable>
        
        <Pressable 
          style={styles.actionButton}
          onPress={() => onDelete(entry.id)}
        >
          <Trash2 size={20} color={colors.error} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  query: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    height: 48,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
});