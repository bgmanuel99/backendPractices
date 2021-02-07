import { querys } from "./querys.ts"
import { mutations } from "./mutations.ts"
import { User } from "./User.ts"
import { Journey } from "./Journey.ts"
import { Car } from "./Car.ts"

export const resolvers = {
  Query: querys,
  Mutation: mutations,
  Journey: Journey,
  Car: Car,
  User: User
};