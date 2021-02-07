import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { CommentSchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext, IUser, IComment } from "./resolversTypes.ts";

export const Post = {
    postAuthor: async (parent: { postAuthor: string }, args: any, context: IContext): Promise<IUser | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: parent.postAuthor })

            return user
        } catch (e) {
            throw new GQLError(e)
        }
    },
    comments: async (parent: { comments: string[] }, args: any, context: IContext): Promise<(IComment | null)[] | null> => {
        try {
            const db: Database = context.db
            const commentCollection: Collection<CommentSchema> = db.collection<CommentSchema>("CommentCollection")
            
            return await Promise.all(parent.comments.map(async (comment) => await commentCollection.findOne({ text: comment })))
        } catch (e) {
            throw new GQLError(e)
        }
    }
};
