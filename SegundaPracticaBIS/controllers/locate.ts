// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
// @ts-ignore
import { JourneySchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postLocate = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const journeyCollection = db.collection<JourneySchema>("JourneyCollection")

        const { ID } = helpers.getQuery(ctx, { mergeParams: true });

        const journey: Partial<JourneySchema> | null = await journeyCollection.findOne({id: Number(ID)})

        if(journey){
            ctx.response.status = 200
            ctx.response.body = journey.car
        }else{
            ctx.response.status = 404
            ctx.response.body = "Not Found: There are no groups in a journey with that ID"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}