import React from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
};

export default function Screen({
  children,
  style,
  scrollable = true,
  paddingHorizontal = 16,
  paddingVertical = 16,
}: ScreenProps) {
  const { colors } = useTheme();

  const screenStyle = {
    ...styles.container,
    backgroundColor: colors.background,
    paddingHorizontal,
    paddingVertical,
  };

  const ContentContainer = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ContentContainer style={[screenStyle, style]}>
        {children}
      </ContentContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});