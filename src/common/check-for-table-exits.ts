import pool from '../dbconfig';

export const tableExistss = (tableName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    pool.query(`SHOW TABLES LIKE '${tableName}'`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};
