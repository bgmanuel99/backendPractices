// @ts-ignore
import { Context } from "https://deno.land/x/oak@v6.3.1/mod.ts"

export interface IClientSchema{
    _id: { $oid: string },
    cif: string,
    name: string,
    address: string,
    mail: string | undefined,
    phone: string | undefined,
}

export interface IClient{
    cif: string,
    name: string,
    address: string,
    mail?: string,
    phone?: string,
}

export interface IProductSchema{
    _id: { $oid: string },
    sku: string,
    name: string,
    price: number,
}

export interface IProduct{
    sku: string,
    name: string,
    price: number,
}

export interface IInvoiceSchema{
    _id: { $oid: string },
    clientCIF: string,
    products: Array<{[key: string]: string | number}>,
}

export interface IInvoice{
    client: IClient,
    products: Array<{[key: string]: string | number}>,
    totalPrice: number,
}

// deno-lint-ignore no-explicit-any
export type IContext = Context<Record<string, any>>