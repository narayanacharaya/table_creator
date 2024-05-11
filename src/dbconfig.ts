import mysql from 'mysql2/promise';

const database = 'fullstack_assignment';

// Create a pool object
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
