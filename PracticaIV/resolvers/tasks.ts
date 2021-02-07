import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { UserSchema } from "../mongo/mongoTypes.ts";
import { IContext, IUser } from "./resolversTypes.ts";

export const Task = {
    reporter: async (parent: { reporter: string }, args: any, context: IContext): Promise<IUser | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: parent.reporter })
            
            return user
        } catch (e) {
            throw new GQLError(e)
        }
    },
    assignee: async (parent: { assignee: string }, args: any, context: IContext): Promise<IUser | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: parent.assignee })
            
            return user
        } catch (e) {
            throw new GQLError(e)
        }
    }
}