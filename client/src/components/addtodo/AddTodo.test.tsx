import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AddTodo, { NewTodoProps } from './AddTodo';

/*
  Encapsulate rendering the component with props overriding. 
  Start by defining some "default" props and then spreading additional
  props passed into the function as overrides. The override props are typed
  as Partial<Props> since they are optional.
  If the Props interface changes, TypeScript will throw a compiler error and
  the test helper will need to be updated, ensuring our tests are kept updated.
*/
const renderAddTodo = (props: Partial<NewTodoProps> = {}) => {
  const defaultProps: NewTodoProps = {
    onAddTodo() {
      return;
    }
  };
  return render(<AddTodo {...defaultProps} {...props} />);
};

describe('<AddTodo />', () => {
  test('should display a submit button', () => {
    const rendered = renderAddTodo();

    const submit = rendered.getByRole('button', { name: /add todo/i });
    expect(submit).toBeInTheDocument();
  });

  test('should display a blank add todo form', async () => {
    const { findByTestId } = renderAddTodo();

    const todoForm = await findByTestId('todo-form');

    expect(todoForm).toHaveFormValues({
      todotitle: '',
      todotext: ''
    });
  });

  test('should allow entering a title', async () => {
    const onAddTodo = jest.fn();
    const { findByTestId, getByRole } = renderAddTodo({ onAddTodo });
    const title = await findByTestId('todotitle');
    const submit = getByRole('button', { name: /add todo/i });

    fireEvent.change(title, { target: { value: 'test' } });
    fireEvent.click(submit);

    expect(onAddTodo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'test',
        text: ''
      })
    );
  });

  test('should require a title', () => {
    const onAddTodo = jest.fn();
    const { getByRole, getByTestId } = renderAddTodo({ onAddTodo });
    const submit = getByRole('button', { name: /add todo/i });
    fireEvent.click(submit);
    expect(onAddTodo).not.toHaveBeenCalled();

    const input = getByTestId('todotitle') as unknown as HTMLInputElement;
    expect(input.placeholder).toBe('Todo title is required!');
    // expect(input.placeholder).not.toBeInTheDocument();
  });

  test('should submit the form with title and text', async () => {
    const onAddTodo = jest.fn();
    const { findByTestId, getByRole } = renderAddTodo({ onAddTodo });
    const title = await findByTestId('todotitle');
    const text = await findByTestId('todotext');
    const submit = getByRole('button', { name: /add todo/i });

    fireEvent.change(title, { target: { value: 'testing title' } });
    fireEvent.change(text, { target: { value: 'testing text' } });
    fireEvent.click(submit);

    expect(onAddTodo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'testing title',
        text: 'testing text'
      })
    );
  });
});
