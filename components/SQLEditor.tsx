import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { CirclePlay as PlayCircle, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type SQLEditorProps = {
  value: string;
  onChangeText: (text: string) => void;
  onExecute: () => void;
  minHeight?: number;
};

export default function SQLEditor({
  value,
  onChangeText,
  onExecute,
  minHeight = 200,
}: SQLEditorProps) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(colors.border);

  // Animation for border color
  useEffect(() => {
    borderColor.value = withTiming(
      isFocused ? colors.primary : colors.border,
      { duration: 200 }
    );
  }, [isFocused, colors.primary, colors.border]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  // Simple syntax highlighting (tokens rendered as different colors)
  const getHighlightedText = () => {
    // This is a simplified version - a real implementation would use a more sophisticated tokenizer
    // Just showing concept here
    return value;
  };

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.editorContainer,
            animatedBorderStyle,
            {
              backgroundColor: colors.codeBackground,
              minHeight: minHeight,
            },
          ]}
        >
          <ScrollView style={styles.scrollContainer}>
            <TextInput
              ref={inputRef}
              style={[
                styles.editor,
                {
                  color: colors.text,
                  fontFamily: 'FiraCode-Regular',
                },
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder="Enter SQL query here..."
              placeholderTextColor={colors.subtext}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </ScrollView>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.error }]}
            onPress={handleClear}
          >
            <Trash2 size={20} color="white" />
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onExecute}
          >
            <PlayCircle size={20} color="white" />
            <Text style={styles.buttonText}>Execute</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  editorContainer: {
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  editor: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontFamily: 'Inter-Bold',
  },
});