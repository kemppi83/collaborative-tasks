import Todo from '../db/models/todos';
import User from '../db/models/users';
import { RequestHandler } from 'express';

import { DatabaseTodo, DatabaseUser } from '../models/models';
import { dbGetTodos } from '../db/helpers'; 

export const createTodo: RequestHandler = async (req, res, next) => {
  const newTodo = req.body as DatabaseTodo;
  newTodo.owner = req.user.uid;

  const callDb = async (email: string) => {
    return await User.findOne({
      email
    }) as DatabaseUser;
  };

  const collaboratorPromises = async () => {
    return Promise.all(newTodo.collaborators.map(email => callDb(email)));
  };

  const collaborators = await collaboratorPromises();
  const uids = collaborators.map(collab => collab.uid);
  newTodo.collaborators = uids;

  const created = await Todo.create(newTodo);
  res.status(201).json({message: 'Created the todo.', createdTodo: created});
};

export const getTodos: RequestHandler = async (req, res, next) => {
  const { uid } = req.user;
  const userTodos = await dbGetTodos(uid);
  res.json({todos: userTodos});
};

export const updateTodo: RequestHandler<{id: string}> = async (req, res, next) => {
  const todo = await Todo.findOne({
    id: req.params.id
  });

  if (!todo) {
    res.status(400).json({ message: 'Todo not found' });
  }

  Object.keys(req.body).map(key => {
    console.log('todo[key]: ', todo[key]);
    console.log('req.body[key]: ', req.body[key]);
    if (todo[key]) {
      todo[key] = req.body[key];
    } else {
      res.status(400).json({ message: `Database 'todos' schema does not include the key ${key}.` });
    }
  });

  const updatedTodo = await todo.save();
  res.json({ message: 'Updated!', updatedTodo });
};

export const deleteTodo: RequestHandler<{id: string}> = (req, res, next) => {
  Todo.deleteOne({
      id: req.params.id
    }, err => {
      if (err) {
        res.status(500).json({ message: err.message });
      }
    });
  
  res.json({ message: 'Todo deleted!' });
};
