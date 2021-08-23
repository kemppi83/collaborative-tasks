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
      // const userTasks = [] as Task[];
      // userTodos.forEach(async todo => {
      //   socket.join(todo.id);
      //   const taskToClient = await DBTask.find({ parent_todo: todo.id }) as Task[];
      //   userTasks.push(...taskToClient);
      // });
      // socket.emit('task:toClient', userTasks);
      userTodos.forEach(async todo => {
        socket.join(todo.id);
        const taskToClient = await DBTask.find({ parent_todo: todo.id }) as Task[];
        taskToClient.map(task => {
          socket.emit('task:toClient', task);
        });
      });
      console.log('socket#rooms: ', socket.rooms);
    });

    socket.on('task:add', async (task: Task) => {
      socket.join(task.parent_todo);
      try {
        await DBTask.create(task);
        socket.to(task.parent_todo).emit('task:toClient', task);
      } catch (err) {
        socket.emit('error', err);
      }
    });
    
    socket.on('task:update', async (task: Task) => {
      const filter = { id: task.id };
      try {
        await DBTask.findOneAndUpdate(filter, task);
        socket.to(task.parent_todo).emit('task:serverUpdated', task);
      } catch (err) {
        socket.emit('error', err);
      }
    });
    
    socket.on('task:delete', async (taskId: string, todoId: string) => {
      const filter = { id: taskId };
      try {
        await DBTask.deleteOne(filter);
        socket.to(todoId).emit('task:serverDeleted', taskId);
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('connect_error', err => {
      console.log(err instanceof Error); // true
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
    
    socket.on('disconnect', () => console.log('User has disconnected'));
  });
};

export default socketHandler;
