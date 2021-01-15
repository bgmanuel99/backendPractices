import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { UserSchema } from "../mongo/mongoTypes.ts";
import { IComment, IContext, IUser } from "./resolversTypes.ts";

export const Comment = {
    commentAuthor: async (parent: IComment, args: any, context: IContext): Promise<IUser | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            
            return await userCollection.findOne({ email: parent.commentAuthor })
        } catch (e) {
            throw new GQLError(e)
        }
    }
};
