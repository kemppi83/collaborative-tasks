import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';

import todoRoutes from './routes/api';
import socketHandler from './sockets';

const app = express();

const origin = process.env.NODE_ENV === 'development'
  ? process.env.FRONTEND_URL_DEV
  : process.env.FRONTEND_URL_PROD;

app.use(helmet());
app.use(cors({ origin }));
app.use(express.json());

app.use('/api', todoRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({message: 'Not found'});
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({message: err.message});
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
});

socketHandler(io);

export default httpServer;
