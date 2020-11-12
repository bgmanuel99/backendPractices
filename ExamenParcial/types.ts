// @ts-ignore
import { Context } from "https://deno.land/x/oak@v6.3.1/mod.ts"

export interface ClientSchema {
    _id: { $oid: string },
    cif: string,
    name: string,
    address: string,
    mail?: string,
    phone?: number,
}

export interface ProductSchema {
    _id: { $oid: string },
    sku: string,
    name: string,
    price: number,
}

export interface InvoiceSchema{
    _id: { $oid: string },
    clientCIF: string,
    products: Array<{[key: string]: string | number}>,
}

// deno-lint-ignore no-explicit-any
export type IContext = Context<Record<string, any>>