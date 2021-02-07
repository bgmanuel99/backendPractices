import { querys } from "./querys.ts"
import { mutations } from "./mutations.ts"

export const resolvers = {
    Query: querys,
    Mutation: mutations
}