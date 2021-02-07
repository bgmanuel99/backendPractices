// @ts-ignore
import { IContext } from '../types.ts'

export const getStatus = async (ctx: IContext) => {
    try{
        ctx.response.status = 200
        ctx.response.body = "OK"
    }catch(e){
        ctx.response.status = 500
        ctx.response.body = `Unexpected Error: ${e.message}`
    }
}