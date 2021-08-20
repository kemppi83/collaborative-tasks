import { Server, Socket } from 'socket.io';

import { FBAuthSocket } from "../util/fbAuth";
import { dbGetTodos } from '../db/helpers';
import { DatabaseTodo, Task } from '../models/models';
import DBTask from '../db/models/tasks';

interface UserSocket extends Socket {
  user?: string;
}

const socketHandler = (io: Server): void => {
  io.use(async (socket: UserSocket, next) => {
    try {
      socket.user = await FBAuthSocket(socket.handshake.auth.token);
      // let userTodos: DatabaseTodo[] = [];
      // if (socket.user) {
      //   userTodos = await dbGetTodos(socket.user);
      // }
      // userTodos.forEach(todo => {
      //   socket.join(todo.id);
      // });
      next();
    } catch (err) {
      next(err);
    }
  });
  
  io.on('connection', (socket: UserSocket) => {
    // console.log('socket_id: ', socket.id);
    socket.on('init', async () => {
      console.log('initissä ollaan');
      let userTodos: DatabaseTodo[] = [];
      if (socket.user) {
        userTodos = await dbGetTodos(socket.user);
      }
      userTodos.forEach(async todo => {
        socket.join(todo.id);
        const taskToClient = await DBTask.find({ parent_todo: todo.id }) as Task[];
        taskToClient.map(task => {
          socket.emit('task:new', task);
        });
      });
      console.log('socket#rooms: ', socket.rooms);
    });
    
    // socket.emit('tasks_to_client', todiI)

    socket.on('join', async (todoId) => {
      socket.join(todoId);
      const taskToClient = await DBTask.find({ parent_todo: todoId });
      console.log(`tasks of todo ${todoId}`, taskToClient);
    });

    socket.on('connect_error', err => {
      console.log(err instanceof Error); // true
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
    socket.on('message', msg => {
      // console.log('got: ', msg);
      socket.broadcast.emit('message', msg);
    });
    socket.on('disconnect', () => console.log('User has disconnected'));
  });
};

export default socketHandler;
