import React, { useState } from 'react';

import { Todo } from './todo.model';
import TodoList from './components/todolist/TodoList';
import AddTodo from './components/addtodo/AddTodo';

const App = (): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const todoAddHandler = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const todoChangeStatusHandler = (todoId: string) => {
    const copyTodos = [...todos];
    const updateIndex = copyTodos.findIndex(i => i.id === todoId);
    if (copyTodos[updateIndex].status === 'active') {
      copyTodos[updateIndex].status = 'done';
    } else {
      copyTodos[updateIndex].status = 'active';
    }
    setTodos(copyTodos);
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos(prevTodos => {
      return prevTodos.filter(todo => todo.id !== todoId);
    });
  };

  return (
    <div className="App">
      <AddTodo onAddTodo={todoAddHandler} />
      <TodoList
        items={todos}
        onChangeStatus={todoChangeStatusHandler}
        onDeleteTodo={todoDeleteHandler}
      />
    </div>
  );
};

export default App;
