// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { CarSchema, JourneySchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postJourney = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const carCollection = db.collection<CarSchema>("CarCollection")
        const journeyCollection = db.collection<JourneySchema>("JourneyCollection")

        ctx.request.headers.get("Content-Type") === "application/json" ? appJSON = true : appJSON = false// To know if it's an application/json

        if(appJSON){
            const body = await ctx.request.body()
            let result = await body.value

            const car: Partial<CarSchema> | null = await carCollection.findOne({$and: [{seats: { $gte: result.people } }, {occupied: false}] })
            
            if(car){
                await carCollection.updateOne(
                    {id: car.id},
                    { $set: { occupied: true } }
                )

                const enter = await journeyCollection.insertOne({
                    ...result,
                    car: {
                        ...car,
                        occupied: true
                    },
                })
                
                if(enter){
                    ctx.response.status = 202
                    ctx.response.body = "Accepted"
                }else{
                    ctx.response.status = 404
                    ctx.response.body = "There was a problem registering the journey"
                }
            }else{
                ctx.response.status = 404
                ctx.response.body = "Not Found: There are no cars that satisfy the specified criteria"
            }
        }else{
            ctx.response.status = 400
            ctx.response.body = "Bad Request: The body of the Content-Type was not an application/json"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}