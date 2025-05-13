import { useState, useCallback } from 'react';
import SQLParser, { ParsedComponents } from '@/lib/SQLParser';

type UseSQLParsingResult = {
  parseSQL: (query: string) => ParsedComponents;
  lastResult: ParsedComponents | null;
};

// Default empty result
const emptyResult: ParsedComponents = {
  statement_type: "SELECT",
  columns: [],
  tables: [],
  conditions: [],
  order_by: [],
  is_valid: false,
  errors: []
};

export function useSQLParsing(): UseSQLParsingResult {
  const [lastResult, setLastResult] = useState<ParsedComponents | null>(null);

  const parseSQL = useCallback((query: string): ParsedComponents => {
    try {
      const parser = new SQLParser();
      parser.parse(query);
      const result = parser.get_parsed_components();
      setLastResult(result);
      return result;
    } catch (error) {
      const errorResult: ParsedComponents = {
        ...emptyResult,
        errors: [`Parsing error: ${error instanceof Error ? error.message : String(error)}`]
      };
      setLastResult(errorResult);
      return errorResult;
    }
  }, []);

  return { parseSQL, lastResult };
}