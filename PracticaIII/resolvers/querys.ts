import { Collection } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts"
import { TaskSchema } from "../mongo/mongoTypes.ts";

interface IGetTaskArgs {
  id: number;
}

interface IGetTaskByStateArgs {
  state: string,
}

interface IGetTaskByDateArgs {
  year: number,
  month: number,
  day: number,
}

interface IContext {
  taskCollection: Collection<TaskSchema>;
}

interface ITask {
  id: number,
  nombre: string,
  descripcion?: string,
  fechaDeFinalizacion: string,
  state: string
}

export const querys = {
  getTask: async (parent: any, args: IGetTaskArgs, context: IContext): Promise<ITask | undefined> => {
    try {
      const task: TaskSchema | null = await context.taskCollection.findOne({ id: args.id })
    
      if (task) return {
        ...task,
        fechaDeFinalizacion: task.fechaDeFinalizacion.toString()
      }
      else return undefined
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getTasks: async (parent: any, args: any, context: IContext): Promise<Array<ITask>> => {
    try {
      const tasks: TaskSchema[] = await context.taskCollection.find({})

      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          fechaDeFinalizacion: task.fechaDeFinalizacion.toString()
        }
      })
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getTaskByState: async (parent: any, args: IGetTaskByStateArgs, context: IContext): Promise<Array<ITask>> => {
    try {
      const tasks: TaskSchema[] = await context.taskCollection.find({ state: args.state })

      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          fechaDeFinalizacion: task.fechaDeFinalizacion.toString(),
        };
      });
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getTaskByDate: async (parent: any, args: IGetTaskByDateArgs, context: IContext): Promise<Array<ITask>> => {
    try {
      const { year, month, day } = args
      const tasks: TaskSchema[] = await context.taskCollection.find({ fechaDeFinalizacion: { $lt: new Date(year, month, day) } })

      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          fechaDeFinalizacion: task.fechaDeFinalizacion.toString(),
        };
      });
    } catch (e) {
      throw new GQLError(e)
    }
  },
};