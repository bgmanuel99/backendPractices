import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { UserSchema } from "../mongo/mongoTypes.ts";

export interface IContext {
    db: Database;
    user: IUser;
}

export interface IIdArgs {
    id: number;
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
    email: string;
    password: string;
    token: string;
}