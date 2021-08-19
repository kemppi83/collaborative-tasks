import * as dotenv from "dotenv";
dotenv.config();
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import './db/dbConnection';
import app from './app';
import { FBAuthSocket } from "./util/fbAuth";

interface UserSocket extends Socket {
  user?: string;
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
});

io.use(async (socket: UserSocket, next) => {
  try {
    socket.user = await FBAuthSocket(socket.handshake.auth.token);
    next();
  } catch (err) {
    next(err);
  }
});

io.on('connection', (socket: UserSocket) => {
  console.log('socket_id: ', socket.id);
  console.log('socket#rooms: ', socket.rooms);
  console.log('socket.user: ', socket.user);
  socket.on('connect_error', err => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
  });
  socket.on('message', msg => {
    console.log('got: ', msg);
    socket.broadcast.emit('message', msg);
  });
});

const port = process.env.PORT || 8080;

httpServer.listen(port, () => console.log(`App is listening to ${port}`));
