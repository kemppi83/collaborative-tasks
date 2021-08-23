import { DatabaseTodo, Task } from '../models/models';
import Todo from '../db/models/todos';
import DBTask from '../db/models/tasks';

export const dbGetTodos = async (uid: string): Promise<DatabaseTodo[]> => {
  const userOwnedTodos = await Todo.find({ owner: uid }, '-_id -owner') as DatabaseTodo[];
  userOwnedTodos.map(todo => todo.owner=true);
  const collaborationTodos = await Todo.find({ collaborators: uid }) as DatabaseTodo[];
  collaborationTodos.map(todo => todo.owner=false);
  return([...userOwnedTodos, ...collaborationTodos]);
};
