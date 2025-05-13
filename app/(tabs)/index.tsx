import React, { useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/Screen';
import HeaderBar from '@/components/HeaderBar';
import SQLEditor from '@/components/SQLEditor';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useSQLParsing } from '@/hooks/useSQLParsing';
import { useHistoryStore } from '@/store/historyStore';

export default function QueryScreen() {
  const [query, setQuery] = useState('');
  const { parseSQL, lastResult } = useSQLParsing();
  const addToHistory = useHistoryStore(state => state.addToHistory);

  const executeQuery = () => {
    if (!query.trim()) return;
    
    // Provide haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const result = parseSQL(query);
    addToHistory(query, result);
  };

  return (
    <Screen paddingHorizontal={0} paddingVertical={0}>
      <HeaderBar title="SQL Parser" />
      
      <Screen>
        <SQLEditor
          value={query}
          onChangeText={setQuery}
          onExecute={executeQuery}
          minHeight={200}
        />
        
        <ResultsDisplay results={lastResult} />
      </Screen>
    </Screen>
  );
}