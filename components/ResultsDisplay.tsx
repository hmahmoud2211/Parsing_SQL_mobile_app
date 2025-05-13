import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ParsedComponents } from '@/lib/SQLParser';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeIn,
  FadeOut 
} from 'react-native-reanimated';

type ResultsDisplayProps = {
  results: ParsedComponents | null;
};

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { colors } = useTheme();
  const offset = useSharedValue(20);

  React.useEffect(() => {
    if (results) {
      offset.value = withSpring(0);
    }
  }, [results]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  if (!results) {
    return null;
  }

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <View 
        style={[
          styles.header, 
          { 
            backgroundColor: results.is_valid ? colors.success : colors.error,
          }
        ]}
      >
        <Text style={styles.headerText}>
          {results.is_valid ? 'Valid SQL Query' : 'Invalid SQL Query'}
        </Text>
      </View>

      <ScrollView 
        style={[
          styles.content, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border, 
          }
        ]}
      >
        {/* Error display */}
        {results.errors.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.error }]}>
              Errors:
            </Text>
            {results.errors.map((error, index) => (
              <Text 
                key={index} 
                style={[styles.errorText, { color: colors.error }]}
              >
                • {error}
              </Text>
            ))}
          </View>
        )}

        {/* Statement type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Query Type:
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {results.statement_type}
          </Text>
        </View>

        {/* SELECT query details */}
        {results.statement_type === 'SELECT' && (
          <>
            {/* Columns */}
            {results.columns && results.columns.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Columns:
                </Text>
                <View style={styles.list}>
                  {results.columns.map((column, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.listItem,
                        { backgroundColor: colors.codeBackground }
                      ]}
                    >
                      <Text style={[styles.code, { color: colors.text }]}>
                        {column}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Tables */}
            {results.tables && results.tables.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Tables:
                </Text>
                <View style={styles.list}>
                  {results.tables.map((table, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.listItem,
                        { backgroundColor: colors.codeBackground }
                      ]}
                    >
                      <Text style={[styles.code, { color: colors.text }]}>
                        {table}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Conditions */}
            {results.conditions && results.conditions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Conditions:
                </Text>
                <Text 
                  style={[
                    styles.code, 
                    { 
                      color: colors.text,
                      backgroundColor: colors.codeBackground,
                      padding: 8,
                      borderRadius: 4,
                    }
                  ]}
                >
                  {results.conditions.join(' ')}
                </Text>
              </View>
            )}

            {/* Order By */}
            {results.order_by && results.order_by.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Order By:
                </Text>
                <View style={styles.list}>
                  {results.order_by.map((orderBy, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.listItem,
                        { backgroundColor: colors.codeBackground }
                      ]}
                    >
                      <Text style={[styles.code, { color: colors.text }]}>
                        {orderBy}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* CREATE TABLE details */}
        {results.statement_type === 'CREATE_TABLE' && results.table_definition && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Table:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {results.table_definition.name}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Columns:
              </Text>
              {results.table_definition.columns.map((column, index) => (
                <View 
                  key={index}
                  style={[
                    styles.columnItem,
                    { 
                      backgroundColor: colors.codeBackground,
                      borderColor: colors.border 
                    }
                  ]}
                >
                  <Text style={[styles.columnName, { color: colors.syntaxKeyword }]}>
                    {column.name}
                  </Text>
                  <Text style={[styles.columnType, { color: colors.syntaxString }]}>
                    {column.type}
                  </Text>
                  {column.constraints && (
                    <Text style={[styles.constraints, { color: colors.syntaxOperator }]}>
                      {column.constraints.join(' ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ALTER TABLE details */}
        {results.statement_type === 'ALTER_TABLE' && results.alter_definition && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Table:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {results.alter_definition.table_name}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Action:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {results.alter_definition.action}
              </Text>
            </View>

            {results.alter_definition.column_name && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Column:
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {results.alter_definition.column_name}
                </Text>
              </View>
            )}

            {results.alter_definition.column_type && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Type:
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {results.alter_definition.column_type}
                </Text>
              </View>
            )}

            {results.alter_definition.referenced_table && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  References:
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {results.alter_definition.referenced_table} ({results.alter_definition.referenced_column})
                </Text>
              </View>
            )}

            {(results.alter_definition.on_delete || results.alter_definition.on_update) && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Constraints:
                </Text>
                {results.alter_definition.on_delete && (
                  <Text style={[styles.value, { color: colors.text }]}>
                    ON DELETE {results.alter_definition.on_delete}
                  </Text>
                )}
                {results.alter_definition.on_update && (
                  <Text style={[styles.value, { color: colors.text }]}>
                    ON UPDATE {results.alter_definition.on_update}
                  </Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  content: {
    padding: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    maxHeight: 500,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  list: {
    gap: 8,
  },
  listItem: {
    padding: 8,
    borderRadius: 4,
  },
  code: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 14,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  columnItem: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  columnName: {
    fontFamily: 'FiraCode-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  columnType: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 13,
  },
  constraints: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 12,
    marginTop: 4,
  },
});