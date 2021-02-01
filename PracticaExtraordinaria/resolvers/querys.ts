import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { JourneySchema, CarSchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext } from "./resolversTypes.ts";

export const querys = {
    getJourneys: async (parent: any, args: any, context: IContext): Promise<JourneySchema[]> => {
        return await context.db.collection<JourneySchema>("JourneyCollection").find()
    },
    getCars: async (parent: any, args: any, context: IContext): Promise<CarSchema[]> => {
        return await context.db.collection<CarSchema>("CarCollection").find()
    },
    getDrivers: async (parent: any, args: any, context: IContext): Promise<UserSchema[]> => {
        return await context.db.collection<UserSchema>("UserCollection").find({role: "DRIVER"})
    },
    getClients: async (parent: any, args: any, context: IContext): Promise<UserSchema[]> => {
        return await context.db.collection<UserSchema>("UserCollection").find({role: "CLIENT"})
    },
}