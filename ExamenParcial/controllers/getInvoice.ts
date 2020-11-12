// @ts-ignore
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts"
// @ts-ignore
import { ProductSchema, ClientSchema, InvoiceSchema } from "../types.ts"
// @ts-ignore
import type { IContext } from "../types.ts"
// @ts-ignore
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts"

export const getInvoice = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db
        let appJSON: boolean = true
        const clientCollection = db.collection<ClientSchema>("ClientCollection")
        const productCollection = db.collection<ProductSchema>("ProductCollection")
        const invoiceCollection = db.collection<InvoiceSchema>("InvoiceCollection")

        const { ID } = helpers.getQuery(ctx, { mergeParams: true });

        const invoice: Partial<InvoiceSchema> | null = await invoiceCollection.findOne({_id: ObjectId(ID)})

        if(invoice){
            const client: Partial<ClientSchema> | null = await clientCollection.findOne({cif: invoice.clientCIF})

            if(client){
                let productList: any[] = []
                let totalPriceOfAll: number = 0

                for(const products of invoice.products){ // I get the products and see if there are errors, if they are not I create a new array with the information i need
                    const product: Partial<ProductSchema> | null = await productCollection.findOne({sku: String(products.sku)})

                    if(product) productList.push([{sku: product.sku, name: product.name}, products.amount, product.price])
                    else{
                        ctx.response.status = 404
                        ctx.response.body = "This should not happen, the product should exists"
                        return
                    }
                }

                let newProductList = productList.map(product => { // I calculate the prices and formated the array so its looks like the solution
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
            }else{
                ctx.response.status = 404
                ctx.response.body = "This should not happen, there should always be a client"
            }
        }else{
            ctx.response.status = 404
            ctx.response.body = "The invoice does not exists"
        }
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}