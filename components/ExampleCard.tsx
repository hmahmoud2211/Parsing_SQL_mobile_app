import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';

type ExampleCardProps = {
  title: string;
  description: string;
  query: string;
  onPress: (query: string) => void;
  delay?: number;
};

export default function ExampleCard({ 
  title, 
  description, 
  query, 
  onPress,
  delay = 0
}: ExampleCardProps) {
  const { colors } = useTheme();
  
  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(delay)}
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        
        <Text style={[styles.description, { color: colors.subtext }]}>
          {description}
        </Text>
        
        <View 
          style={[
            styles.codeContainer, 
            { 
              backgroundColor: colors.codeBackground,
              borderColor: colors.codeBorder 
            }
          ]}
        >
          <Text 
            style={[styles.code, { color: colors.text }]}
            numberOfLines={4}
          >
            {query}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => onPress(query)}
      >
        <Text style={styles.buttonText}>Use Example</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  codeContainer: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  code: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});