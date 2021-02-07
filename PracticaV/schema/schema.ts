import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export const schema = gql`
  type User {
    email: String!
    password: String!
    roles: [String!]!
    posts: [Post!]!
  }

  type Comment {
    text: String!
    commentAuthor: User!
  }

  type Post {
    title: String!
    body: String!
    postAuthor: User!
    comments: [Comment!]!
  }

  input PostInput {
    title: String!
    body: String!
  }

  input AddUserInput {
    email: String!
    password: String!
    roles: [String!]!
  }

  input AddCommentInput {
    postTitle: String!
    text: String!
  }

  input DeleteCommentInput {
    postTitle: String!
    commentText: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type Query {
    getPosts: [Post!]!
  }

  type Mutation {
    addPost(input: PostInput!): Boolean!
    deletePost(postTitle: String!): Boolean!
    addComment(input: AddCommentInput!): Boolean!
    deleteComment(input: DeleteCommentInput!): Boolean!
    addUser(input: AddUserInput!): Boolean!
    login(input: LoginUserInput!): String!
    logout: Boolean!
    deleteUser(email: String!): Boolean!
  }
`;
