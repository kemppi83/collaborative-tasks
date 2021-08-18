import Todo from '../db/models/todos';
import { RequestHandler } from 'express';

import { DatabaseTodo } from '../models/todo';

const TODOS: DatabaseTodo[] = [];

export const createTodo: RequestHandler = async (req, res, next) => {
  const newTodo = req.body as DatabaseTodo;
  newTodo.owner = req.user.uid;

  TODOS.push(newTodo);
  const created = await Todo.create(newTodo);
  console.log('TODOS: ', TODOS);
  res.status(201).json({message: 'Created the todo.', createdTodo: created});
};

export const getTodos: RequestHandler = async (req, res, next) => {
  // const { uid } = req.user;
  // const userOwnedTodos = await Todo.find({ owner: uid }, '-_id -owner') as DatabaseTodo[];
  const userOwnedTodos = await Todo.find({}) as DatabaseTodo[];
  userOwnedTodos.map(todo => todo.owner=true);
  res.json({todos: userOwnedTodos});
};

export const updateTodo: RequestHandler<{id: string}> = (req, res, next) => {
  console.log('TODOS: ', TODOS);
  const todoId = req.params.id;

  // const updatedTodo = req.body as Todo;
  const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
  
  if (todoIndex < 0) {
    throw new Error('Could not find todo!');
  }

  if (TODOS[todoIndex].status === 'active') {
    TODOS[todoIndex].status = 'done';
  } else {
    TODOS[todoIndex].status = 'active';
  }

  console.log('TODOS: ', TODOS);
  res.json({ message: 'Updated!', updatedTodo: TODOS[todoIndex] });
};

export const deleteTodo: RequestHandler<{id: string}> = (req, res, next) => {
  console.log('TODOS: ', TODOS);
  const todoId = req.params.id;

  const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
  
  if (todoIndex < 0) {
    res.json({ message: 'Could not find todo!' });
  }

  TODOS.splice(todoIndex, 1);
  res.json({ message: 'Todo deleted!' });
};
