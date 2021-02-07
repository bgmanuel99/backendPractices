// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { IProductSchema, IProduct } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postProduct = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        const productCollection = db.collection<IProductSchema>("ProductCollection")

        if(ctx.request.headers.get("Content-Type") !== "application/json"){
            ctx.response.status = 400
            ctx.response.body = "The request content-type is not an application/json"
            return
        }

        const data = await ctx.request.body().value

        for(const product of data){
            if(!(product.sku && product.name && product.price && product.price > 0)){
                ctx.response.status = 400
                ctx.response.body = "Some of the products doesnt have the required data"
                return
            }
        }

        const result = data.map(async (product: IProductSchema) => await productCollection.findOne({sku: product.sku}))

        let finalData: any[] = await Promise.all(result)

        for(let i: number = 0; i < finalData.length; i++){
            if(!finalData[i]) finalData.splice(i, 1)
        }

        const inserted = await productCollection.insertMany(finalData)

        if(inserted){
            ctx.response.status = 200
            ctx.response.body = "OK"
        }else{
            ctx.response.status = 400
            ctx.response.body = "There was an error inserting the products in the DDBB"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected error: ${e.message}`
    }
}