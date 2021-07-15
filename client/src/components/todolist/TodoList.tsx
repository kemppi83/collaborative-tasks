import React from 'react';

import { Todo } from '../../todo.model';
// import './TodoList.css';

export interface TodoListProps {
  items: Todo[];
  onChangeStatus: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList = (props: TodoListProps): JSX.Element => {
  return (
    <ul>
      {props.items.map(todo => (
        <li key={todo.id} className={`todocard__${todo.status}`}>
          <p className="todocard__title">{todo.title}</p>
          <p className="todocard__text">{todo.text}</p>
          {todo.status === 'active' ? (
            <button
              className="button--done"
              onClick={props.onChangeStatus.bind(null, todo.id)}
            >
              Mark as done
            </button>
          ) : (
            <button
              className="button--active"
              onClick={props.onChangeStatus.bind(null, todo.id)}
            >
              Reactivate
            </button>
          )}
          <button
            className="button--delete"
            onClick={props.onDeleteTodo.bind(null, todo.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
