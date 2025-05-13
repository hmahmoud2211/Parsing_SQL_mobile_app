import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Code, History, BookOpen, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { theme, colors } = useTheme();
  const colorScheme = useColorScheme();
  
  const tabBarStyle = {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: tabBarStyle,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
          marginBottom: 4,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Query',
          tabBarIcon: ({ color, size }) => (
            <Code size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}