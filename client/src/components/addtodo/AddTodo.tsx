import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Todo } from '../../todo.model';
// import './NewTodo.css';

export interface NewTodoProps {
  onAddTodo: (todo: Todo) => void;
}

const AddTodo = (props: NewTodoProps): JSX.Element => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoText, setTodoText] = useState('');
  const [error, setError] = useState('');

  const handleTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTodoTitle(value);
  };

  const handleTodoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTodoText(value);
  };

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!todoTitle) {
      return setError('Todo title is required!');
    }

    setError('');
    props.onAddTodo({
      id: uuidv4(),
      title: todoTitle,
      text: todoText,
      timestamp: Date.now(),
      status: 'active'
    });
  };

  return (
    <form data-testid="todo-form" onSubmit={todoSubmitHandler}>
      <h3>Register New ToDo</h3>

      <label htmlFor="todotitle">Title:</label>
      <input
        data-testid="todotitle"
        placeholder={error}
        type="text"
        name="todotitle"
        value={todoTitle}
        onChange={handleTodoTitleChange}
      />

      <label htmlFor="todotext">Text:</label>
      <input
        data-testid="todotext"
        type="text"
        name="todotext"
        value={todoText}
        onChange={handleTodoTextChange}
      />

      <button type="submit" data-testid="submit">
        Add todo
      </button>
    </form>
  );
};

export default AddTodo;
