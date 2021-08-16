import { Router } from 'express';

import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todos';
import { signUp, login, resetPassword, verifyToken } from '../controllers/auth';
import { FBAuth } from '../util/fbAuth';

const router = Router();

// verify token
router.get('/verifytoken', FBAuth, verifyToken);

// user routes
router.post('/signup', signUp);
router.post('/login', login);
router.post('/recover', resetPassword);

// todo routes
router.post('/todos', FBAuth, createTodo);
router.get('/todos', FBAuth, getTodos);
router.patch('/todos/:id', FBAuth, updateTodo);
router.delete('/todos/:id', FBAuth, deleteTodo);

export default router;
