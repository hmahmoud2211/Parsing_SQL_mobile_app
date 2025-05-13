import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Linking, Platform } from 'react-native';
import Screen from '@/components/Screen';
import HeaderBar from '@/components/HeaderBar';
import { useTheme } from '@/contexts/ThemeContext';
import { Laptop, Moon, Github as GitHub, Info, ExternalLink } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme, isDark } = useTheme();

  const handleToggleTheme = () => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    toggleTheme();
  };

  const handleLinkPress = (url: string) => {
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Linking.openURL(url);
  };

  return (
    <Screen paddingHorizontal={0} paddingVertical={0}>
      <HeaderBar title="Settings" showThemeToggle={false} />
      
      <View style={styles.content}>
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          
          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.border 
              }
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Moon size={20} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleToggleTheme}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor="white"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Laptop size={20} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  System Theme
                </Text>
              </View>
              <Text style={[styles.settingValue, { color: colors.subtext }]}>
                Auto
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          
          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.border 
              }
            ]}
          >
            <Pressable 
              style={styles.settingRow}
              onPress={() => handleLinkPress('https://github.com/yourusername/sql-parser-mobile')}
            >
              <View style={styles.settingInfo}>
                <GitHub size={20} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  GitHub Repository
                </Text>
              </View>
              <ExternalLink size={20} color={colors.primary} />
            </Pressable>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <Pressable 
              style={styles.settingRow}
              onPress={() => handleLinkPress('https://github.com/yourusername/sql-parser-mobile/issues')}
            >
              <View style={styles.settingInfo}>
                <Info size={20} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Report an Issue
                </Text>
              </View>
              <ExternalLink size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.subtext }]}>
            SQL Parser Mobile
          </Text>
          <Text style={[styles.versionNumber, { color: colors.subtext }]}>
            Version 1.0.0
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  versionNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});