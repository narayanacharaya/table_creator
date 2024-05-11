import express, { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { tableExistss } from '../common/check-for-table-exits';
import pool from '../dbconfig';
const router: Router = express.Router();

// Route for creating a record in the table
router.post('/:tableName', async (req: Request, res: Response) => {
  const { tableName } = req.params;
  try {
    const tableExists = await tableExistss(tableName);
    if (!tableExists) {
      return res.status(400).json({ error: 'Table does not exist' });
    }

    const record = req.body;
    const columnNames = Object.keys(record).join(', ');
    const columnValues = Object.keys(record)
      .map((key) => pool.escape(record[key]))
      .join(', ');

    const [results] = await pool.query(
      `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnValues})`
    );
    const insertId = (results as any)?.insertId;

    res.status(201).json({
      message: 'Record created successfully',
      insertId: insertId,
    });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Error creating record' });
  }
});

// Route for fetching all records from the table
router.get('/:tableName', async (req: Request, res: Response) => {
  const { tableName } = req.params;
  try {
    const tableExists = await tableExistss(tableName);
    if (!tableExists) {
      return res.status(400).json({ error: 'Table does not exist' });
    }

    const [results] = await pool.query(`SELECT * FROM ${tableName}`);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Error fetching records' });
  }
});

// Route for updating a record in the table
router.put('/:tableName/:id', async (req: Request, res: Response) => {
  const { tableName, id } = req.params;
  const updatedRecord = req.body;
  try {
    const tableExists = await tableExistss(tableName);
    if (!tableExists) {
      return res.status(400).json({ error: 'Table does not exist' });
    }

    await pool.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [
      updatedRecord,
      id,
    ]);
    res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Error updating record' });
  }
});

// Route for deleting a record from the table
router.delete('/:tableName/:id', async (req: Request, res: Response) => {
  const { tableName, id } = req.params;
  try {
    const tableExists = await tableExistss(tableName);
    if (!tableExists) {
      return res.status(400).json({ error: 'Table does not exist' });
    }

    const [results] = await pool.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      id
    );
    if ((results as any[]).length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, id);
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Error deleting record' });
  }
});

export { router as crudRouter };
