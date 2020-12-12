import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export const schema = gql`
  type User {
    email: String!
    password: String!
    reporterTasks: [Task!]!
    assigneeTasks: [Task!]!
  }

  type Task {
    id: Int!
    name: String!
    description: String
    date: String!
    state: String!
    reporter: User!
    assignee: User!
  }

  input UserInput {
    email: String!
    password: String!
  }

  input TaskAddInput {
    id: Int!
    name: String!
    description: String
    year: Int!
    month: Int!
    day: Int!
    state: String!
    assignee_mail: String!
  }

  input TaskUpdateInput {
    id: Int!
    name: String!
    description: String
    year: Int!
    month: Int!
    day: Int!
    state: String!
  }

  type Query {
    getTask(id: Int!): Task
    getTasks: [Task!]!
    getTaskByState(state: String!): [Task!]!
    getMyTasks: [Task!]!
    getMyOpenTasks: [Task!]!
    getUsers: [User!]!
  }

  type Mutation {
    addTask(input: TaskAddInput!): Boolean!
    removeTask(id: Int!): Boolean!
    updateTask(input: TaskUpdateInput!): Boolean!
    completeTask(id: Int!): Boolean!
    startTask(id: Int!): Boolean!
    signin(input: UserInput!): Boolean!
    login(email: String!, password: String!): Boolean!
    logout: Boolean!
    deleteAccount: Boolean!
  }
`;