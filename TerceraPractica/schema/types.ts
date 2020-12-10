import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export const types = gql`
  type Task {
    id: Int!
    nombre: String!
    descripcion: String
    fechaDeFinalizacion: String!
    state: String!
  }

  input TaskSchema {
    id: Int!
    nombre: String!
    descripcion: String
    year: Int!
    month: Int!
    day: Int!
    state: String!
  }

  type Query {
    getTask(id: Int!): Task
    getTasks: [Task]!
    getTaskByState(state: String!): [Task]!
    getTaskByDate(year: Int!, month: Int!, day: Int!): [Task]!
  }

  type Mutation {
    addTask(input: TaskSchema!): Boolean!
    removeTask(id: Int!): Boolean!
    updateTask(input: TaskSchema!): Boolean!
    completeTask(id: Int!): Boolean!
    startTask(id: Int!): Boolean!
  }
`;