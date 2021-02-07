import { querys } from "./querys.ts"
import { mutations } from "./mutations.ts"
import { Task } from "./tasks.ts"
import { User } from "./users.ts"

export const resolvers = {
    Query: querys,
    Mutation: mutations,
    Task: Task,
    User: User
}