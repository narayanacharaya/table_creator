import express, { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { tableExistss } from '../common/check-for-table-exits';
import pool from '../dbconfig'; // Assuming you have pool defined in dbconfig

const router: Router = express.Router();
interface Column {
  name: string;
  type: string;
  nullable?: boolean;
}
// Route for creating a table
router.post(
  '/create',
  [
    // Validation middleware using express-validator
    body('tableName')
      .notEmpty()
      .withMessage('Table name is required')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Invalid table name for MySQL'),
    body('columns')
      .isArray({ min: 1 })
      .withMessage('Columns must be an array with at least one column'),
    body('columns.*.name').notEmpty().withMessage('Column name is required'),
    body('columns.*.type').notEmpty().withMessage('Column type is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tableName, columns } = req.body;

      // Check if table with the same name already exists
      const tableExistsResult = await tableExistss(tableName);
      if (tableExistsResult) {
        return res
          .status(400)
          .json({ error: 'Table with the same name already exists' });
      }

      // Construct the SQL query for creating the table
      let query = `CREATE TABLE ${tableName} (`;

      // Add columns to the query
      columns.forEach((column: Column, index: number) => {
        query += `${column.name} ${column.type}`;
        if (!column.nullable) {
          query += ' NOT NULL';
        }
        if (index !== columns.length - 1) {
          query += ', ';
        }
      });

      query += ')';

      // Execute the SQL query to create the table
      const [results] = await pool.query(query);

      console.log('Table created successfully');
      res.status(200).json({ message: 'Table created successfully' });
    } catch (error) {
      console.error('Error creating table:', error);
      res.status(500).json({ error: 'Error creating table' });
    }
  }
);

export { router as tablerouter };
