import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";

export interface IContext {
    db: Database;
    user: IUser;
}

export interface IPost {
    title: string;
    body: string;
    postAuthor: string;
    comments: string[];
}

export interface IUser {
    email: string;
    password: string;
    roles: string[];
    token: string;
}

export interface IComment {
    text: string;
    commentAuthor: string;
}