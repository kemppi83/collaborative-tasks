import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TodoList, { TodoListProps } from './TodoList';

/*
  Encapsulate rendering the component with props overriding. 
  Start by defining some "default" props and then spreading additional
  props passed into the function as overrides. The override props are typed
  as Partial<Props> since they are optional.
  If the Props interface changes, TypeScript will throw a compiler error and
  the test helper will need to be updated, ensuring our tests are kept updated.
*/
const renderTodoList = (props: Partial<TodoListProps> = {}) => {
  const defaultProps: TodoListProps = {
    items: [
      {
        id: 'defaultId',
        title: 'default title',
        text: 'default text',
        timestamp: Date.now(),
        status: 'active'
      }
    ],
    onChangeStatus() {
      return;
    },
    onDeleteTodo() {
      return;
    }
  };
  return render(<TodoList {...defaultProps} {...props} />);
};

describe('<TodoList />', () => {
  test('should render all elements', () => {
    const { getByRole, getByText } = renderTodoList();

    const markButton = getByRole('button', { name: /mark as done/i });
    expect(markButton).toBeInTheDocument();
    const deleteButton = getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    const title = getByText(/default title/i);
    expect(title).toBeInTheDocument();
    const text = getByText(/default text/i);
    expect(text).toBeInTheDocument();
  });

  test('should render reactivate button', () => {
    const items = [
      {
        id: 'testId',
        title: 'test title',
        text: 'test text',
        timestamp: Date.now(),
        status: 'done'
      }
    ];
    const { getByRole, getByText } = renderTodoList({ items });

    const markButton = getByRole('button', { name: /reactivate/i });
    expect(markButton).toBeInTheDocument();
    const deleteButton = getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    const title = getByText(/test title/i);
    expect(title).toBeInTheDocument();
    const text = getByText(/test text/i);
    expect(text).toBeInTheDocument();
  });

  test('should call event handlers on button clicks', () => {
    const onChangeStatus = jest.fn();
    const onDeleteTodo = jest.fn();
    const { getByRole } = renderTodoList({
      onChangeStatus,
      onDeleteTodo
    });

    const markButton = getByRole('button', { name: /mark as done/i });
    const deleteButton = getByRole('button', { name: /delete/i });

    fireEvent.click(markButton);
    fireEvent.click(deleteButton);

    expect(onChangeStatus).toHaveBeenCalledWith(
      'defaultId',
      expect.any(Object)
    );
    expect(onDeleteTodo).toHaveBeenCalledWith('defaultId', expect.any(Object));
  });
});
