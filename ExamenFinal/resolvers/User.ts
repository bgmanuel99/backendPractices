import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { CarSchema, JourneySchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext } from "./resolversTypes.ts";

export const User = {
    car: async (parent: UserSchema, args: any, context: IContext): Promise<CarSchema | null> => {
        try {
            const db: Database = context.db
            const carCollection: Collection<CarSchema> = db.collection<CarSchema>("CarCollection")

            if (parent.role === "DRIVER") return await carCollection.findOne({ driver: parent.email })
            else return null
        } catch (e) {
            throw new GQLError(e)
        }
    },
    journey: async (parent: UserSchema, args: any, context: IContext): Promise<(JourneySchema | null)[] | null> => {
        try {
            const db: Database = context.db
            const journeyCollection: Collection<JourneySchema> = db.collection<JourneySchema>("JourneyCollection")

            if (parent.role === "DRIVER") return await journeyCollection.find({ driver: parent.email })
            else return await journeyCollection.find({ client: parent.email })
        } catch (e) {
            throw new GQLError(e)
        }
    },
}