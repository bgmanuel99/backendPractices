import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { UserSchema } from "../mongo/mongoTypes.ts";
import { IContext } from "./resolversTypes.ts";

export const Car = {
    driver: async (parent: {driver: string}, args: any, context: IContext): Promise<UserSchema | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            return await userCollection.findOne({ email: parent.driver })
        } catch (e) {
            throw new GQLError(e)
        }
    }
};