// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { CarSchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const putCars = async (ctx: IContext) => {
    try {
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const carCollection = db.collection<CarSchema>("CarCollection")

        ctx.request.headers.get("Content-Type") === "application/json" ? appJSON = true : appJSON = false// To know if it's an application/json

        if (appJSON) {
            const body = await ctx.request.body()
            let result = await body.value

            for (const car of result) {
                if (car.seats < 4 || car.seats > 6) {
                    ctx.response.status = 400
                    ctx.response.body = "Some of the cars dont have the appropiate data values"
                    return
                }
            }

            await carCollection.deleteMany({}) // deleteMany returns the number of deleted objects in the DDBB

            const resultFormatted = result.map((car: CarSchema) => {
                return {
                    ...car,
                    occupied: false,
                }
            })

            const inserted: any[] = await carCollection.insertMany(resultFormatted) // insertMany returns an array of id objects

            if(inserted.length === resultFormatted.length){
                ctx.response.status = 200
                ctx.response.body = "OK"
            }else{
                ctx.response.status = 400
                ctx.response.body = "There was a problem introducing the cars into the DDBB"
            }
        } else {
            ctx.response.status = 400
            ctx.response.body = "The body of the Content-Type was not an application/json"
        }
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}