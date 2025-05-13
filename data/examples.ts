export interface SQLExample {
  id: string;
  title: string;
  description: string;
  query: string;
  category: 'select' | 'create' | 'alter';
}

export const sqlExamples: SQLExample[] = [
  {
    id: 'select-basic',
    title: 'Basic SELECT Query',
    description: 'Retrieve all columns from a table with a simple condition',
    query: 'SELECT * FROM users WHERE age > 18',
    category: 'select'
  },
  {
    id: 'select-join',
    title: 'SELECT with JOIN',
    description: 'Join multiple tables to retrieve related data',
    query: 'SELECT users.name, orders.order_date FROM users JOIN orders ON users.id = orders.user_id',
    category: 'select'
  },
  {
    id: 'select-aggregate',
    title: 'Aggregate Functions',
    description: 'Use aggregate functions to summarize data',
    query: 'SELECT COUNT(*), AVG(price), MAX(price) FROM products WHERE category = "electronics"',
    category: 'select'
  },
  {
    id: 'select-group',
    title: 'GROUP BY with ORDER BY',
    description: 'Group results and order them by a specific column',
    query: 'SELECT category, COUNT(*) as total FROM products GROUP BY category ORDER BY total DESC',
    category: 'select'
  },
  {
    id: 'create-basic',
    title: 'Create Simple Table',
    description: 'Create a table with basic column definitions',
    query: 'CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100) UNIQUE, created_at TIMESTAMP)',
    category: 'create'
  },
  {
    id: 'create-constraints',
    title: 'Table with Constraints',
    description: 'Create a table with various constraints',
    query: 'CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL, price DECIMAL(10,2) NOT NULL, category VARCHAR(50))',
    category: 'create'
  },
  {
    id: 'alter-add',
    title: 'Add Column',
    description: 'Add a new column to an existing table',
    query: 'ALTER TABLE users ADD last_login TIMESTAMP',
    category: 'alter'
  },
  {
    id: 'alter-foreign',
    title: 'Add Foreign Key',
    description: 'Add a foreign key constraint to a table',
    query: 'ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
    category: 'alter'
  }
];