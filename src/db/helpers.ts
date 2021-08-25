import { DatabaseTodo, DatabaseUser } from '../models/models';
import Todo from '../db/models/todos';
import User from '../db/models/users';

export const dbGetTodos = async (uid: string): Promise<DatabaseTodo[]> => {
  const userOwnedTodos = await Todo.find({ owner: uid }, '-_id -owner') as DatabaseTodo[];
  userOwnedTodos.map(async todo => todo.owner=true);
  const collaborationTodos = await Todo.find({ collaborators: uid }) as DatabaseTodo[];
  collaborationTodos.map(async todo => todo.owner=false);

  const todosArray = [...userOwnedTodos, ...collaborationTodos];

  const mapThroughTodos = async () => {
    return Promise.all(todosArray.map(async todo => {
      const callDb = async (uid: string) => {
        return await User.findOne({
          uid
        }) as DatabaseUser;
      };
    
      const collaboratorPromises = async () => {
        return Promise.all(todo.collaborators.map(uid => callDb(uid)));
      };
    
      const collaborators = await collaboratorPromises();
      const emails = collaborators.map(collab => collab.email);
      todo.collaborators = emails;
      return todo;
    }));
  };

  const returnArray = await mapThroughTodos();
  return(returnArray);
};
