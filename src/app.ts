import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';

import todoRoutes from './routes/api';
import socketHandler from './sockets';

const app = express();

let origin: string;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.FRONTEND_URL_PROD) {
    throw new Error('Frontend URL not provided');
  }
  origin = `${process.env.FRONTEND_URL_PROD}`;
} else {
  if (!process.env.FRONTEND_URL_DEV) {
    throw new Error('Frontend URL not provided');
  }
  origin = `${process.env.FRONTEND_URL_DEV}`;
}

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
    origin: [origin],
    credentials: true
  }
});

socketHandler(io);

export default httpServer;
