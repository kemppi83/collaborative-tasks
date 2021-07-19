import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import * as dotenv from "dotenv";
dotenv.config();

import todoRoutes from './routes/api';


const app = express();

app.use(json());

app.use('/api', todoRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({message: err.message});
});

app.listen(3001);
