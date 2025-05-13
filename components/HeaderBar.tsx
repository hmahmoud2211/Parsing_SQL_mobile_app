import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react-native';

type HeaderBarProps = {
  title: string;
  showThemeToggle?: boolean;
  rightComponent?: React.ReactNode;
};

export default function HeaderBar({ 
  title, 
  showThemeToggle = true,
  rightComponent
}: HeaderBarProps) {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border, 
        }
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <View style={styles.rightContainer}>
        {showThemeToggle && (
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.iconButton}
          >
            {theme === 'light' ? (
              <Moon size={24} color={colors.text} />
            ) : (
              <Sun size={24} color={colors.text} />
            )}
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
});