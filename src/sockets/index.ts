import { Server, Socket } from 'socket.io';
import { FBAuthSocket } from "../util/fbAuth";
import { dbGetTodos } from '../db/helpers';
import { DatabaseTodo, Task, DatabaseUser } from '../models/models';
import DBTask from '../db/models/tasks';
import User from '../db/models/users';

interface UserSocket extends Socket {
  user?: string;
}

const socketHandler = (io: Server): void => {
  io.use(async (socket: UserSocket, next) => {
    try {
      socket.user = await FBAuthSocket(socket.handshake.auth.token);
      
      next();
    } catch (err) {
      next(err);
    }
  });
  
  io.on('connection', (socket: UserSocket) => {
    socket.on('init', async () => {
      if (socket.user) {
        socket.join(socket.user);
      }
      let userTodos: DatabaseTodo[] = [];
      if (socket.user) {
        userTodos = await dbGetTodos(socket.user);
      }
      userTodos.forEach(async todo => {
        socket.join(todo.id);
        const taskToClient = await DBTask.find({ parent_todo: todo.id }) as Task[];
        taskToClient.map(task => {
          socket.emit('task:toClient', task);
        });
      });
      // console.log('socket#rooms: ', socket.rooms);
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

    socket.on('todo:add', async (todo: DatabaseTodo) => {
      const callDb = async (email: string) => {
        return await User.findOne({
          email
        }) as DatabaseUser;
      };
    
      const collaboratorPromises = async () => {
        return Promise.all(todo.collaborators.map(email => callDb(email)));
      };
    
      const collaborators = await collaboratorPromises();
      collaborators.map(collab => {
        io.to(collab.uid).emit('todo:toClient', todo);
      });
    });

    socket.on('todo:subscribe', async (todoId: string) => {
      socket.join(todoId);
      const taskToClient = await DBTask.find({ parent_todo: todoId }) as Task[];
      taskToClient.map(task => {
        socket.emit('task:toClient', task);
      });
      // console.log('socket#rooms: ', socket.rooms);
    });

    socket.on('todo:update', (todo: DatabaseTodo) => {
      console.log(todo);
      io.to(todo.id).emit('todo:serverUpdated', todo);
    });

    socket.on('todo:delete', (todoId:string) => {
      io.to(todoId).emit('todo:unsubscribe', todoId);
    });

    socket.on('todo:leave-room', (todoId: string) => {
      socket.leave(todoId);
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
