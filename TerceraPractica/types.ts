import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export const types = gql`
  type Task {
    id: Int
    nombre: String
    descripcion: String
    fechaDeFinalizacion: Int
    state: String
  }

  input TaskSchema {
    id: Int
    nombre: String
    descripcion: String
    fechaDeFinalizacion: Int
    state: String
  }

  type ResolveType {
    done: Boolean
  }

  type Query {
    getTask(id: Int): Task
    getTasks: [Task]!
    getTaskByState(state: String): [Task]!
    getTaskByDate(fecha: Int): [Task]!
  }

  type Mutation {
    addTask(input: TaskSchema!): ResolveType!
    removeTask(id: Int): ResolveType!
    updateTask(input: TaskSchema!): ResolveType!
    completeTask(id: Int): ResolveType!
    startTask(id: Int): ResolveType!
  }
`;

export interface TaskSchema {
  _id: { $oid: string };
  id: number;
  nombre: string;
  descripcion: string;
  fechaDeFinalizacion: number;
  state: string;
}