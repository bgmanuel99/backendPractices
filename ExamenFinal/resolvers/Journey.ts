import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { UserSchema, CarSchema, JourneySchema } from "../mongo/mongoTypes.ts";
import { IContext } from "./resolversTypes.ts";

export const Journey = {
    driver: async (parent: {driver: string}, args: any, context: IContext): Promise<UserSchema | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            
            return await userCollection.findOne({ email: parent.driver })
        } catch (e) {
            throw new GQLError(e)
        }
    },
    client: async (parent: {client: string}, args: any, context: IContext): Promise<UserSchema | null> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            
            return await userCollection.findOne({ email: parent.client })
        } catch (e) {
            throw new GQLError(e)
        }
    },
    car: async (parent: JourneySchema, args: any, context: IContext): Promise<CarSchema | null> => {
        try {
            const db: Database = context.db
            const carCollection: Collection<CarSchema> = db.collection<CarSchema>("CarCollection")

            return await carCollection.findOne({enrollment: parent.car})
        } catch (e) {
            throw new GQLError(e)
        }
    },
};