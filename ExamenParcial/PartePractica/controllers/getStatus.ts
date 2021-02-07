// @ts-ignore
import { IContext } from '../types.ts'

export const getStatus = async (ctx: IContext) => {
    ctx.response.status = 200
    ctx.response.body = "OK"
}