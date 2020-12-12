export interface TaskSchema {
  _id: { $oid: string };
  id: number;
  name: string;
  description?: string;
  date: Date;
  state: string;
  reporter: string;
  assignee: string;
}

export interface UserSchema {
  _id: { $oid: string };
  email: string;
  password: string;
  token?: string | null;
}