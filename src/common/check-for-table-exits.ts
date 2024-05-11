import { QueryResult } from 'mysql2';
import pool from '../dbconfig';

export const tableExistss = async (tableName: string): Promise<boolean> => {
  try {
    const [results, fields] = await pool.query(
      `SHOW TABLES LIKE '${tableName}'`
    );

    console.log(`SHOW TABLES LIKE '${tableName}'`);

    console.log((results as []).length);
    return (results as []).length > 0;
  } catch (error) {
    throw new Error(`Error checking table existence: ${error}`);
  }
};
