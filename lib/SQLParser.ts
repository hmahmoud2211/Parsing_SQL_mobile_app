export type ColumnDefinition = {
  name: string;
  type?: string;
  constraints?: string[];
};

export type TableDefinition = {
  name: string | null;
  columns: ColumnDefinition[];
  constraints: string[];
};

export type AlterDefinition = {
  table_name: string | null;
  action: string | null;
  column_name: string | null;
  column_type: string | null;
  constraint_name?: string | null;
  referenced_table?: string;
  referenced_column?: string;
  on_delete?: string;
  on_update?: string;
};

export type ParsedComponents = {
  statement_type: "SELECT" | "CREATE_TABLE" | "ALTER_TABLE";
  columns?: string[];
  tables?: string[];
  conditions?: string[];
  order_by?: string[];
  table_definition?: TableDefinition;
  alter_definition?: AlterDefinition;
  is_valid: boolean;
  errors: string[];
};

export default class SQLParser {
  private tokens: string[] = [];
  private columns: string[] = [];
  private tables: string[] = [];
  private conditions: string[] = [];
  private order_by: string[] = [];
  private current_clause: string | null = null;
  private errors: string[] = [];
  private statement_type: "SELECT" | "CREATE_TABLE" | "ALTER_TABLE" | null = null;
  private table_definition: TableDefinition = {
    name: null,
    columns: [],
    constraints: []
  };
  private alter_definition: AlterDefinition = {
    table_name: null,
    action: null,
    column_name: null,
    column_type: null,
    constraint_name: null
  };

  tokenize(query: string): string[] {
    query = query.trim().replace(';', '');
    const tokens: string[] = [];
    let current_token = "";
    let i = 0;

    // Normalize the query by adding spaces around keywords
    const keywords = [
      "CREATE", "TABLE", "ALTER", "ADD", "FOREIGN", "KEY", "REFERENCES", 
      "ON", "DELETE", "UPDATE", "SET", "NULL", "PRIMARY", "UNIQUE", "NOT", "CASCADE",
      "SELECT", "FROM", "WHERE", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET",
      "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "NATURAL", "USING",
      "AND", "OR", "IN", "BETWEEN", "LIKE", "IS", "NOT", "NULL", "ASC", "DESC"
    ];
    
    // Add spaces around keywords
    let normalizedQuery = query;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      normalizedQuery = normalizedQuery.replace(regex, ` ${keyword.toUpperCase()} `);
    }

    // Normalize multiple spaces
    normalizedQuery = normalizedQuery.replace(/\s+/g, ' ').trim();

    while (i < normalizedQuery.length) {
      const char = normalizedQuery[i];
      
      // Handle whitespace
      if (char.trim() === '') {
        if (current_token) {
          tokens.push(current_token);
          current_token = "";
        }
        i++;
        continue;
      }
      
      // Handle punctuation and operators
      if (',><=()!*'.includes(char)) {
        if (current_token) {
          tokens.push(current_token);
          current_token = "";
        }
        // Handle compound operators (>=, <=, !=)
        if ((char === '>' || char === '<' || char === '!') && 
            i + 1 < normalizedQuery.length && 
            normalizedQuery[i + 1] === '=') {
          tokens.push(char + '=');
          i += 2;
          continue;
        }
        tokens.push(char);
        i++;
        continue;
      }
      
      current_token += char;
      i++;
    }

    if (current_token) {
      tokens.push(current_token);
    }
    
    // Clean up tokens and normalize case for keywords
    this.tokens = tokens.filter(t => t.trim()).map(token => {
      if (keywords.includes(token.toUpperCase())) {
        return token.toUpperCase();
      }
      return token;
    });
    
    // Check for common syntax errors
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      if (token.toUpperCase() === "DEL") {
        this.errors.push("Invalid keyword 'DEL'. Did you mean 'DELETE'?");
      } else if (token.toUpperCase() === "CASCADE" && 
                i > 0 && 
                !["DELETE", "UPDATE"].includes(this.tokens[i-1].toUpperCase())) {
        this.errors.push("CASCADE must follow DELETE or UPDATE");
      }
    }
    
    return this.tokens;
  }

  validate_syntax(): boolean {
    this.errors = [];
    
    // Check if query starts with SELECT
    if (!this.tokens.length || this.tokens[0].toUpperCase() !== "SELECT") {
      this.errors.push("Query must start with SELECT");
      return false;
    }

    // Check for required clauses
    const required_clauses = ["SELECT", "FROM"];
    const found_clauses = new Set<string>();
    
    for (const token of this.tokens) {
      const token_upper = token.toUpperCase();
      if (required_clauses.includes(token_upper)) {
        found_clauses.add(token_upper);
      }
    }

    // Check if all required clauses are present
    const missing_clauses = required_clauses.filter(clause => !found_clauses.has(clause));
    if (missing_clauses.length) {
      this.errors.push(`Missing required clauses: ${missing_clauses.join(', ')}`);
      return false;
    }

    // Validate SELECT clause
    if (!this.columns.length) {
      this.errors.push("SELECT clause must specify at least one column");
      return false;
    }

    // Validate FROM clause
    if (!this.tables.length) {
      this.errors.push("FROM clause must specify at least one table");
      return false;
    }

    // Validate WHERE clause if present
    if (this.tokens.some(t => t.toUpperCase() === "WHERE")) {
      if (!this.conditions.length) {
        this.errors.push("WHERE clause must contain conditions");
        return false;
      }
    }

    // Validate ORDER BY clause if present
    if (this.tokens.some(t => t.toUpperCase() === "ORDER")) {
      if (!this.order_by.length) {
        this.errors.push("ORDER BY clause must specify columns");
        return false;
      }
    }

    // Check for balanced parentheses in conditions
    if (this.conditions.length) {
      let parentheses_count = 0;
      for (const token of this.conditions) {
        if (token === '(') {
          parentheses_count++;
        } else if (token === ')') {
          parentheses_count--;
        }
        if (parentheses_count < 0) {
          this.errors.push("Unbalanced parentheses in conditions");
          return false;
        }
      }
      if (parentheses_count !== 0) {
        this.errors.push("Unbalanced parentheses in conditions");
        return false;
      }
    }

    return this.errors.length === 0;
  }

  validate_create_table(): boolean {
    if (!this.tokens.length || this.tokens.length < 4) {
      this.errors.push("Invalid CREATE TABLE statement");
      return false;
    }

    // Check basic CREATE TABLE structure
    if (this.tokens[0].toUpperCase() !== "CREATE" || this.tokens[1].toUpperCase() !== "TABLE") {
      this.errors.push("Statement must start with CREATE TABLE");
      return false;
    }

    // Extract table name
    this.table_definition.name = this.tokens[2];

    // Check for opening parenthesis
    if (!this.tokens.includes('(')) {
      this.errors.push("Missing column definitions");
      return false;
    }

    // Validate column definitions
    let in_column_def = false;
    let current_column: ColumnDefinition = { name: '' };
    
    for (let i = 3; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      
      if (token === '(') {
        continue;
      } else if (token === ')') {
        break;
      } else if (token === ',') {
        if (current_column.name) {
          this.table_definition.columns.push(current_column);
          current_column = { name: '' };
        }
        in_column_def = false;
        continue;
      }
      
      if (!in_column_def) {
        current_column.name = token;
        in_column_def = true;
      } else {
        if (!current_column.type) {
          current_column.type = token;
        } else if (['PRIMARY', 'FOREIGN', 'UNIQUE', 'NOT', 'NULL'].includes(token.toUpperCase())) {
          if (!current_column.constraints) {
            current_column.constraints = [];
          }
          current_column.constraints.push(token);
        }
      }
    }

    // Add the last column if exists
    if (current_column.name) {
      this.table_definition.columns.push(current_column);
    }

    // Validate that we have at least one column
    if (!this.table_definition.columns.length) {
      this.errors.push("Table must have at least one column");
      return false;
    }

    return true;
  }

  validate_alter_table(): boolean {
    if (!this.tokens.length || this.tokens.length < 4) {
      this.errors.push("Invalid ALTER TABLE statement");
      return false;
    }

    // Check basic ALTER TABLE structure
    if (this.tokens[0].toUpperCase() !== "ALTER" || this.tokens[1].toUpperCase() !== "TABLE") {
      this.errors.push("Statement must start with ALTER TABLE");
      return false;
    }

    // Extract table name
    this.alter_definition.table_name = this.tokens[2];

    // Validate ALTER actions
    const action_index = 3;
    if (action_index >= this.tokens.length) {
      this.errors.push("Missing ALTER action");
      return false;
    }

    // Handle ADD CONSTRAINT for foreign keys
    if (this.tokens[action_index].toUpperCase() === "ADD" && action_index + 1 < this.tokens.length) {
      if (this.tokens[action_index + 1].toUpperCase() === "FOREIGN") {
        // Parse foreign key constraint
        this.alter_definition.action = "ADD_FOREIGN_KEY";
        try {
          // Find the key column
          const key_start = this.tokens.indexOf("KEY") + 1;
          if (key_start < this.tokens.length && this.tokens[key_start] === "(") {
            const key_end = this.tokens.indexOf(")", key_start);
            this.alter_definition.column_name = this.tokens[key_start + 1];
            
            // Find the referenced table and column
            const ref_index = this.tokens.indexOf("REFERENCES", key_end);
            if (ref_index + 1 < this.tokens.length) {
              this.alter_definition.referenced_table = this.tokens[ref_index + 1];
              if (ref_index + 2 < this.tokens.length && this.tokens[ref_index + 2] === "(") {
                const ref_col_end = this.tokens.indexOf(")", ref_index + 2);
                this.alter_definition.referenced_column = this.tokens[ref_index + 3];
                
                // Check for ON DELETE/UPDATE clauses
                for (let i = ref_col_end + 1; i < this.tokens.length; i++) {
                  if (this.tokens[i].toUpperCase() === "ON") {
                    if (i + 2 < this.tokens.length) {
                      const action_type = this.tokens[i + 1].toUpperCase();
                      const action_value = this.tokens[i + 2].toUpperCase();
                      
                      // Validate action type
                      if (action_type !== "DELETE" && action_type !== "UPDATE") {
                        this.errors.push(`Invalid action type: ${action_type}. Must be DELETE or UPDATE`);
                        return false;
                      }
                      
                      // Validate action value
                      if (!["SET", "CASCADE", "NULL"].includes(action_value)) {
                        this.errors.push(`Invalid action value: ${action_value}. Must be SET, CASCADE, or NULL`);
                        return false;
                      }
                      
                      if (action_type === "DELETE") {
                        this.alter_definition.on_delete = action_value;
                      } else {
                        this.alter_definition.on_update = action_value;
                      }
                    } else {
                      this.errors.push("Incomplete ON clause");
                      return false;
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          this.errors.push(`Invalid foreign key constraint syntax: ${e}`);
          return false;
        }
        return true;
      }
    }

    const action = this.tokens[action_index].toUpperCase();
    this.alter_definition.action = action;

    if (action === "ADD") {
      if (action_index + 2 >= this.tokens.length) {
        this.errors.push("Invalid ADD column syntax");
        return false;
      }
      this.alter_definition.column_name = this.tokens[action_index + 1];
      this.alter_definition.column_type = this.tokens[action_index + 2];
    } else if (action === "DROP") {
      if (action_index + 1 >= this.tokens.length) {
        this.errors.push("Invalid DROP syntax");
        return false;
      }
      this.alter_definition.column_name = this.tokens[action_index + 1];
    } else if (action === "MODIFY") {
      if (action_index + 2 >= this.tokens.length) {
        this.errors.push("Invalid MODIFY syntax");
        return false;
      }
      this.alter_definition.column_name = this.tokens[action_index + 1];
      this.alter_definition.column_type = this.tokens[action_index + 2];
    } else {
      this.errors.push(`Unsupported ALTER action: ${action}`);
      return false;
    }

    return true;
  }

  parse(query: string): boolean {
    this.tokenize(query);
    this.columns = [];
    this.tables = [];
    this.conditions = [];
    this.order_by = [];
    this.current_clause = null;
    this.table_definition = { name: null, columns: [], constraints: [] };
    this.alter_definition = { table_name: null, action: null, column_name: null, column_type: null };
    
    // Determine statement type
    if (this.tokens.length >= 2) {
      if (this.tokens[0].toUpperCase() === "CREATE" && this.tokens[1].toUpperCase() === "TABLE") {
        this.statement_type = "CREATE_TABLE";
        return this.validate_create_table();
      } else if (this.tokens[0].toUpperCase() === "ALTER" && this.tokens[1].toUpperCase() === "TABLE") {
        this.statement_type = "ALTER_TABLE";
        return this.validate_alter_table();
      } else if (this.tokens[0].toUpperCase() === "SELECT") {
        this.statement_type = "SELECT";
        
        // Process SELECT query
        let currentClause = '';
        for (let i = 0; i < this.tokens.length; i++) {
          const token = this.tokens[i];
          
          // Determine current clause
          if (['SELECT', 'FROM', 'WHERE', 'ORDER'].includes(token.toUpperCase())) {
            currentClause = token.toUpperCase();
            
            // Handle ORDER BY as a single clause
            if (token.toUpperCase() === 'ORDER' && i + 1 < this.tokens.length && this.tokens[i + 1].toUpperCase() === 'BY') {
              currentClause = 'ORDER BY';
              i++; // Skip the 'BY'
            }
            continue;
          }
          
          // Process tokens based on current clause
          if (currentClause === 'SELECT') {
            if (token !== ',') {
              this.columns.push(token);
            }
          } else if (currentClause === 'FROM') {
            if (token !== ',') {
              this.tables.push(token);
            }
          } else if (currentClause === 'WHERE') {
            this.conditions.push(token);
          } else if (currentClause === 'ORDER BY') {
            if (token !== ',') {
              this.order_by.push(token);
            }
          }
        }
        
        return this.validate_syntax();
      }
    }
    
    this.errors.push("Invalid SQL statement");
    return false;
  }

  get_parsed_components(): ParsedComponents {
    if (this.statement_type === "CREATE_TABLE") {
      return {
        statement_type: "CREATE_TABLE",
        table_definition: this.table_definition,
        is_valid: this.errors.length === 0,
        errors: this.errors
      };
    } else if (this.statement_type === "ALTER_TABLE") {
      return {
        statement_type: "ALTER_TABLE",
        alter_definition: this.alter_definition,
        is_valid: this.errors.length === 0,
        errors: this.errors
      };
    } else {
      return {
        statement_type: "SELECT",
        columns: this.columns,
        tables: this.tables,
        conditions: this.conditions,
        order_by: this.order_by,
        is_valid: this.errors.length === 0,
        errors: this.errors
      };
    }
  }
}