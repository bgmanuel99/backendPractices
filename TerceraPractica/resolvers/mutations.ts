import { Collection } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { gql, GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { TaskSchema } from "../mongo/mongoTypes.ts";

interface IIdTaskArgs {
  id: number;
}

interface IContext {
  taskCollection: Collection<TaskSchema>;
}

interface IAddUpdateTaskArgs {
  input: {
    id: number;
    nombre: string;
    descripcion?: string;
    year: number;
    month: number;
    day: number;
    state: string;
  }
}

export const mutations = {
  addTask: async (parent: any, args: IAddUpdateTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      const finded: TaskSchema | null = await context.taskCollection.findOne({ id: args.input.id })
    
      if (finded) throw new GQLError("There is already a task with that id in the DDBB")

      const insert = await context.taskCollection.insertOne({
        id: args.input.id,
        nombre: args.input.nombre,
        descripcion: args.input.descripcion,
        fechaDeFinalizacion: new Date(args.input.year, args.input.month, args.input.day),
        state: args.input.state,
      });

      if (insert) return true
      else throw new GQLError("There was a problem inserting the task into the DDBB")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  removeTask: async (parent: any, args: IIdTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      // It is not neccessary to find first if the task is inside the DDBB, if the task is inside the method deleteOne will delete the task, if its not then it would do nothing
      const removed = await context.taskCollection.deleteOne({ id: args.id })

      if (removed) return true
      else return false
    } catch (e) {
      throw new GQLError(e)
    }
  },
  updateTask: async (parent: any, args: IAddUpdateTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      const finded: TaskSchema | null = await context.taskCollection.findOne({ id: args.input.id });

      if (!finded) throw new GQLError("There is no task inside the DDBB with that id")

      const updated = await context.taskCollection.updateOne(
        { id: args.input.id },
        {
          $set: {
            nombre: args.input.nombre,
            descripcion: args.input.descripcion,
            fechaDeFinalizacion: new Date(args.input.year, args.input.month, args.input.day),
            state: args.input.state,
          },
        }
      );

      if (updated) return true
      else throw new GQLError("There was a problem updating the task in the DDBB")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  completeTask: async (parent: any, args: IIdTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      const finded: TaskSchema | null = await context.taskCollection.findOne({ id: args.id });

      if (!finded) throw new GQLError("There is no task inside the DDBB with that id")

      const completed = await context.taskCollection.updateOne(
        { id: args.id },
        {
          $set: {
            state: "DONE",
          },
        }
      );

      if (completed) return true
      else throw new GQLError("There was a problem updating the task to the state DONE")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  startTask: async (parent: any, args: IIdTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      const finded: TaskSchema | null = await context.taskCollection.findOne({ id: args.id });

      if (!finded) throw new GQLError("There is no task inside the DDBB with that id")

      const started = await context.taskCollection.updateOne(
        { id: args.id },
        {
          $set: {
            state: "DOING",
          },
        }
      );

      if (started) return true
      else throw new GQLError("There was a problem updating the task to the state DOING")
    } catch (e) {
      throw new GQLError(e)
    }
  },
};