import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { PostSchema } from "../mongo/mongoTypes.ts";
import { IContext, IPost, IUser } from "./resolversTypes.ts";

export const User = {
    posts: async (parent: IUser, args: any, context: IContext): Promise<IPost[] | null> => {
        try {
            const db: Database = context.db
            const postCollection: Collection<PostSchema> = db.collection<PostSchema>("PostCollection")

            return await postCollection.find({ postAuthor: parent.email })
        } catch (e) {
            throw new GQLError(e)
        }
    }
};
