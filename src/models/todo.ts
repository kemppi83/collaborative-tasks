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
// export class Todo {
//   // TS shorthand syntax:
//   constructor(
//     public id: string,
//     public title: string,
//     public text: string,
//     public timestamp: number,
//     public status: string,
//     public tasks: 
//     ) {}
// }
