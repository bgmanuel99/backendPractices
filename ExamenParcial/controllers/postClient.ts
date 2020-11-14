// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { ClientSchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postClient = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const clientCollection = db.collection<ClientSchema>("ClientCollection")

        ctx.request.headers.get("Content-Type") === "application/json" ? appJSON = true : appJSON = false // To know if it's an application/json

        if (appJSON) {
            const body = await ctx.request.body()
            const data = await body.value

            for(const client of data){ // This for looks if there is missed data in the clients
                if(client.cif && client.name && client.address){
                    continue
                }else{
                    ctx.response.status = 400
                    ctx.response.body = "Some of the clients have missed data"
                    return
                }
            }
            
            const result = data.map(async (client: Partial<ClientSchema>) => { // This map is to avoid inserting already existing clients in the DDBB
                const existClient: Partial<ClientSchema> | null = await clientCollection.findOne({cif: client.cif})
                if(!existClient) return client
            })

            const finalData: Partial<ClientSchema>[] = await Promise.all(result)

            const insert = await clientCollection.insertMany(finalData)

            if(insert){
                ctx.response.status = 200
                ctx.response.body = "OK"
            }else{
                ctx.response.status = 400
                ctx.response.body = "There was an error inserting the client into the DDBB"
            }
        }else{
            ctx.response.status = 400
            ctx.response.body = "The body of the Content-Type was not an application/json"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}