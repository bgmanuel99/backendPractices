// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
// @ts-ignore
import { CarSchema, JourneySchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postDropoff = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const carCollection = db.collection<CarSchema>("CarCollection")
        const journeyCollection = db.collection<JourneySchema>("JourneyCollection")

        const { ID } = helpers.getQuery(ctx, { mergeParams: true });

        const journey = await journeyCollection.findOne({id: Number(ID) })

        if(journey){
            const deleted = await journeyCollection.deleteOne({id: Number(ID)})

            if(deleted){ // I first delet the journey, then if it was succesfull the car occupation goes false, if it was not succesful no change is made in the DDBB
                await carCollection.updateOne(
                    {id: journey.car.id},
                    { $set: { occupied: false } }
                )

                ctx.response.status = 200
                ctx.response.body = "The journey has ended succesfully"
            }else{
                ctx.response.status = 404
                ctx.response.body = "Not Found: There was a problem finishing the journey"
            }
        }else{
            ctx.response.status = 404
            ctx.response.body = "Not Found: There are no groups in a journey with that ID"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}