// Remember: every class automatically acts as a type in TS!
export class Todo {
  // TS shorthand syntax:
  constructor(
    public id: string,
    public title: string,
    public text: string,
    public timestamp: number,
    public status: string
    ) {}
}
