import { querys } from "./querys.ts"
import { mutations } from "./mutations.ts"
import { User } from "./users.ts"
import { Post } from "./posts.ts"
import { Comment } from  "./comments.ts"

export const resolvers = {
  Query: querys,
  Mutation: mutations,
  User: User,
  Post: Post,
  Comment: Comment,
};
