// Remember: every class automatically acts as a type in TS!
export interface DatabaseTodo {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  status: string;
  collaborators: string[];
  tasks: string[];
  owner?: boolean | string;
}

export interface Task {
  id: string;
  parent_todo: string;
  parent_task?: string;
  title: string;
  timestamp: number;
  status: string;
  children: string[];
}

export interface DatabaseUser {
  uid: string,
  username: string,
  email: string,
  owned_todos: string[],
  joined_todos: string[],
}
