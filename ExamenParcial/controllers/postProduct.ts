// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { ProductSchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postProduct = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const productCollection = db.collection<ProductSchema>("ProductCollection")

        ctx.request.headers.get("Content-Type") === "application/json" ? appJSON = true : appJSON = false // To know if it's an application/json

        if (appJSON) {
            const body = await ctx.request.body()
            let data = await body.value

            for(const product of data){ // This for looks if there is missed data in the products
                if((product.sku && product.name && product.price) && (product.price >= 0)){
                    continue
                }else{
                    ctx.response.status = 400
                    ctx.response.body = "Some of the products have missed data or wrong data"
                    return
                }
            }

            const result = data.map(async (product: Partial<ProductSchema>) => { // This map is to avoid inserting already existing products in the DDBB
                const existsProduct: Partial<ProductSchema> | null = await productCollection.findOne({sku: product.sku})
                if(!existsProduct) return product
            })

            const finalData: Partial<ProductSchema>[] = await Promise.all(result)

            const insert = await productCollection.insertMany(finalData)

            if(insert){
                ctx.response.status = 200
                ctx.response.body = "OK"
            }else{
                ctx.response.status = 400
                ctx.response.body = "There was an error inserting the product into the DDBB"
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