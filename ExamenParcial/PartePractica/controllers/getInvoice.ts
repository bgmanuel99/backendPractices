// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
// @ts-ignore
import { IInvoiceSchema, IInvoice, IClientSchema, IProductSchema } from "../types.ts";
// @ts-ignore
import type { IContext } from "../types.ts";
// @ts-ignore
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts"
// @ts-ignore
import { ObjectId } from  "https://deno.land/x/mongo@v0.12.1/ts/types.ts"

export const getInvoice = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        const clientCollection = db.collection<IClientSchema>("ClientCollection")
        const productCollection = db.collection<IProductSchema>("ProductCollection")
        const invoiceCollection = db.collection<IInvoiceSchema>("InvoiceCollection")

        const { ID } = helpers.getQuery(ctx, { mergeParams: true });

        const invoice: IInvoiceSchema | null = await invoiceCollection.findOne({_id: ObjectId(ID)})

        if(!invoice){
            ctx.response.status = 404
            ctx.response.body = "The invoice does not exists"
            return
        }

        const client: Partial<IClientSchema> | null = await clientCollection.findOne({cif: invoice.clientCIF})

        if(!client){
            ctx.response.status = 404
            ctx.response.body = "This should not happen, there should always be a client"
            return
        }

        let productList: any[] = []
        let totalPriceOfAll: number = 0

        const products: (IProductSchema | null)[] = await Promise.all(invoice.products.map(async (product) => productCollection.findOne({sku: String(product.sku)})))

        for(let i = 0; i < products.length; i++){
            if(products[i]) productList.push([{sku: products[i].sku, name: products[i].name}, invoice.products[i].amount, products[i].price])
            else{
                ctx.response.status = 404
                ctx.response.body = "This should not happen, the product should exists"
                return
            }
        }

        let newProductList = productList.map(product => {
            totalPriceOfAll += (product[1] * product[2])
            return {
                ...product[0],
                amount: product[1],
                totalPrice: product[1] * product[2]
            }
        })

        ctx.response.status = 200
        ctx.response.body = {
            ...client,
            products: newProductList,
            totalPrice: totalPriceOfAll
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}