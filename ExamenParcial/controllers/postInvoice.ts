// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { ProductSchema, ClientSchema, InvoiceSchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postInvoice = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const clientCollection = db.collection<ClientSchema>("ClientCollection")
        const productCollection = db.collection<ProductSchema>("ProductCollection")
        const invoiceCollection = db.collection<InvoiceSchema>("InvoiceCollection")

        ctx.request.headers.get("Content-Type") === "application/json" ? appJSON = true : appJSON = false // To know if it's an application/json

        if (appJSON) {
            const body = await ctx.request.body()
            let data = await body.value
            
            const client: Partial<ClientSchema> | null = await clientCollection.findOne({cif: data.clientCIF})

            if(client){
                data.products.forEach(async (product: any) => {
                    const existsProduct: Partial<ProductSchema> | null = await productCollection.findOne({sku: product.sku})

                    if(!existsProduct){
                        ctx.response.status = 404
                        ctx.response.body = "Some products were not found in the DDBB"
                        return
                    }else if(product.amount < 0){
                        ctx.response.status = 400
                        ctx.response.body = "Some products have negative amount"
                        return
                    }
                })

                const insert = await invoiceCollection.insertOne(data)

                if(insert){
                    ctx.response.status = 202
                    ctx.response.body = "Accepted"
                }else{
                    ctx.response.status = 400
                    ctx.response.body = "There was an error inserting the invoice into the DDBB"
                }
            }else{
                ctx.response.status = 404
                ctx.response.body = "The client was not found in the DDBB"
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