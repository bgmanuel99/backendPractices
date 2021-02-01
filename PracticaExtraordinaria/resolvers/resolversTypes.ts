import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts"
import { UserSchema } from "../mongo/mongoTypes.ts"

export interface IContext {
    db: Database;
    user: IUser;
}

export type IUser = UserSchema