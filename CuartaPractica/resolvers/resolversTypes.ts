import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";

export interface IContext {
    db: Database
}

export interface IIdArgs {
    id: number
}

export interface ITask {
    id: number;
    name: string;
    description?: string;
    date: string;
    state: string;
    reporter: string;
    assignee: string;
}

export interface IUser {
  email: string | undefined;
  password: string | undefined;
  reporterTasks: number[];
  assigneeTasks: number[];
}