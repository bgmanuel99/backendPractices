import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export const types = gql`
  type Task {
    id: Int
    nombre: String
    descripcion: String
    fechaDeFinalizacion: String
    state: String
  }

  input TaskSchema {
    id: Int
    nombre: String
    descripcion: String
    fechaDeFinalizacion: String
    state: String
  }

  type Query {
    getTask(id: Int): Task
    getTasks: [Task]!
    getTaskByState(state: String): [Task]!
    getTaskByDate(fecha: String): [Task]!
  }

  type Mutation {
    addTask(input: TaskSchema!): String!
    removeTask(id: Int): String!
    updateTask(input: TaskSchema!): String!
    completeTask(id: Int): String!
    startTask(id: Int): String!
  }
`;

export interface TaskSchema {
  _id: { $oid: string };
  id: number;
  nombre: string;
  descripcion: string;
  fechaDeFinalizacion: string;
  state: string;
}