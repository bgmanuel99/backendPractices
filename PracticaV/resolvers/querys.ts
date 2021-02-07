import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { PostSchema } from "../mongo/mongoTypes.ts";
import { IContext, IPost } from "./resolversTypes.ts";

export const querys = {
    getPosts: async (parent: any, args: any, context: IContext): Promise<Array<IPost>> => {
        try {
            return await context.db.collection<PostSchema>("PostCollection").find()
        } catch (e) {
            throw new GQLError(e)
        }
    }
};
