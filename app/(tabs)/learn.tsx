import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import Screen from '@/components/Screen';
import HeaderBar from '@/components/HeaderBar';
import ExampleCard from '@/components/ExampleCard';
import { sqlExamples, SQLExample } from '@/data/examples';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Define category tabs
const categories = [
  { id: 'all', label: 'All Examples' },
  { id: 'select', label: 'SELECT' },
  { id: 'create', label: 'CREATE' },
  { id: 'alter', label: 'ALTER' }
];

export default function LearnScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter examples based on active category
  const filteredExamples = activeCategory === 'all' 
    ? sqlExamples 
    : sqlExamples.filter(example => example.category === activeCategory);

  const handleExamplePress = (query: string) => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Navigate to the query tab and set the query
    navigation.navigate('index' as never);
    // You'd ideally set the query text in the store instead, but we're using local state in this MVP
  };

  const handleCategoryPress = (categoryId: string) => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setActiveCategory(categoryId);
  };

  return (
    <Screen paddingHorizontal={0} paddingVertical={0}>
      <HeaderBar title="Learn SQL" />
      
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                },
                { borderColor: colors.border }
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: activeCategory === category.id
                      ? 'white'
                      : colors.text
                  }
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {filteredExamples.map((example, index) => (
          <ExampleCard
            key={example.id}
            title={example.title}
            description={example.description}
            query={example.query}
            onPress={handleExamplePress}
            delay={index * 100} // Staggered animation
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});