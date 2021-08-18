import * as dotenv from "dotenv";
dotenv.config();
import './db/dbConnection';
import app from './app';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/api/'
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('message', msg => {
    console.log('got: ', msg);
    // const payload = JSON.parse(msg);
    // if (chatLogs[payload.roomID]) {
    //   chatLogs[msg.roomID].push(payload.data);
    // }
    socket.broadcast.emit('event://get-message', msg);
  });
});

const port = process.env.PORT || 8080;

httpServer.listen(port, () => console.log(`App is listening to ${port}`));
