import express from 'express';
import { tablerouter } from './routes/table-routes';
import { crudRouter } from './routes/crud-routes';

const app = express();
const port: number | string = process.env.PORT || 4000;

app.use(express.json());

// Mount routes
app.use('/tables', tablerouter);
app.use('/crud', crudRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
