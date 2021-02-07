import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts"
import { TaskSchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext, IIdArgs, ITask, IUser } from "./resolversTypes.ts"

interface IGetTaskByStateArgs {
  state: string,
}

export const querys = {
  getTask: async (parent: any, args: IIdArgs, context: IContext): Promise<ITask | undefined> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const task: TaskSchema | null = await taskCollection.findOne({ id: args.id })
      
      if(task) return {
        ...task,
        date: task.date.toString()
      }
      else return undefined
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getTasks: async (parent: any, args: any, context: IContext): Promise<Array<ITask>> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const tasks: TaskSchema[] = await taskCollection.find({})

      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          date: task.date.toString(),
        }
      })
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getTaskByState: async (parent: any, args: IGetTaskByStateArgs, context: IContext): Promise<Array<ITask>> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const tasks: TaskSchema[] = await taskCollection.find({ state: args.state })

      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          date: task.date.toString()
        };
      })
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getMyTasks: async (parent: any, args: any, context: IContext): Promise<Array<ITask>> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const tasks: TaskSchema[] = await taskCollection.find({ $or: [{ reporter: context.user.email }, { assignee: context.user.email }] })
      
      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          date: task.date.toString()
        }
      })
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getMyOpenTasks: async (parent: any, args: any, context: IContext): Promise<Array<ITask>> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")

      const tasks: TaskSchema[] = await taskCollection.find({
        $and: [
          { state: { $ne: "DONE" } },
          {
            $or: [
              { reporter: context.user.email },
              { assignee: context.user.email },
            ],
          },
        ],
      })

      return tasks.map((task: TaskSchema) => {
        return {
          ...task,
          date: task.date.toString()
        }
      })
    } catch (e) {
      throw new GQLError(e)
    }
  },
  getUsers: async (parent: any, args: any, context: IContext) => {
    try {
      return await context.db.collection<UserSchema>("UserCollection").find()
    } catch (e) {
      throw new GQLError(e)
    }
  }
};