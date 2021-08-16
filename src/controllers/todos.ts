// import { Request, Response, NextFunction } from 'express';

// export const createTodo = (req: Request, res: Response, next: NextFunction) => {};

// The same can be done easier!
import { RequestHandler } from 'express';

import { Todo } from '../models/todo';

const TODOS: Todo[] = [];

export const createTodo: RequestHandler = (req, res, next) => {
  const newTodo = req.body as Todo;

  TODOS.push(newTodo);
  console.log('TODOS: ', TODOS);
  res.status(201).json({message: 'Created the todo.', createdTodo: newTodo});
};

export const getTodos: RequestHandler = (req, res, next) => {
  res.json({todos: TODOS});
};

export const updateTodo: RequestHandler<{id: string}> = (req, res, next) => {
  console.log('TODOS: ', TODOS);
  const todoId = req.params.id;
  if (todoId !== req.body.id) {
    throw new Error("Request paramter id and request body id don't match");
  }

  const updatedTodo = req.body as Todo;
  const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
  
  if (todoIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS[todoIndex] = updatedTodo;
  res.json({ message: 'Updated!', updatedTodo: TODOS[todoIndex] });
};

export const deleteTodo: RequestHandler<{id: string}> = (req, res, next) => {
  console.log('TODOS: ', TODOS);
  const todoId = req.params.id;

  const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
  
  if (todoIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS.splice(todoIndex, 1);
  res.json({ message: 'Todo deleted!' });
};
