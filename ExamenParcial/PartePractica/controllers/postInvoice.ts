// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { IInvoiceSchema, IInvoice, IClientSchema, IProductSchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";

export const postInvoice = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        const clientCollection = db.collection<IClientSchema>("ClientCollection")
        const productCollection = db.collection<IProductSchema>("ProductCollection")
        const invoiceCollection = db.collection<IInvoiceSchema>("InvoiceCollection")

        if(ctx.request.headers.get("Content-Type") !== "application/json"){
            ctx.response.status = 400
            ctx.response.body = "The request content-type is not an application/json"
            return
        }

        const data = await ctx.request.body().value

        Object.keys(data).forEach(key => {
            if(!["clientCIF", "products"].includes(key)) throw new Error("There is invalid data in the request")
        })

        if(!(data.clientCIF && data.products)) throw new Error("The invoice doesnt hace the required properties")

        const client: Partial<IClientSchema> | null = await clientCollection.findOne({cif: data.clientCIF})
        if(!client){
            ctx.response.status = 404
            ctx.response.body = "The client was not found in the DDBB"
            return
        }

        const products = data.products.map(async (product: any) => await productCollection.findOne({sku: product.sku}))

        const finalData = await Promise.all(products)

        finalData.forEach((product: any) => {
            if(!product) throw new Error("A product was not found in the DDBB")
        })

        data.products.forEach((product: any) => {
            if(product.amount <= 0) throw new Error("There are products with negative amounts in the request")
        })

        const insert = await invoiceCollection.insertOne(data)
        
        if(insert){
            ctx.response.status = 200
            ctx.response.body = "OK"
        }else{
            ctx.response.status = 400
            ctx.response.body = "There was an error inserting the invoice in the DDBB"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected error: ${e.message}`
    }
}