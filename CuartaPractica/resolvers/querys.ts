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
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
      if (!loggedinUser) throw new GQLError("This should not happen, to be able to use this function there should be a user logged in")
      
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
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
      if (!loggedinUser) throw new GQLError("This should not happen, to be able to use this function there should be a user logged in")
      
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
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
      if (!loggedinUser) throw new GQLError("This should not happen, to be able to use this function there should be a user logged in")
      
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
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
      if (!loggedinUser) throw new GQLError("This should not happen, to be able to use this function there should be a user logged in")
      
      const tasks: TaskSchema[] = await taskCollection.find({ $or: [{ reporter: loggedinUser.email }, { assignee: loggedinUser.email }] })
      
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
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
      if (!loggedinUser) throw new GQLError("This should not happen, to be able to use this function there should be a user logged in")

      const tasks: TaskSchema[] = await taskCollection.find({
        $and: [
          { state: { $ne: "DONE" } },
          {
            $or: [
              { reporter: loggedinUser.email },
              { assignee: loggedinUser.email },
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
  getUsers: async (parent: any, args: any, context: IContext): Promise<Array<IUser>> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
      if (!loggedinUser) throw new GQLError("This should not happen, to be able to use this function there should be a user logged in")

      const users: UserSchema[] = await userCollection.find({})

      return await Promise.all(users.map(async (user: UserSchema) => {
        const reporterTasks: TaskSchema[] = await taskCollection.find({ reporter: user.email })
        const parsedReporterTaks: number[] = reporterTasks.map((task: TaskSchema) => task.id)

        const assigneeTasks: TaskSchema[] = await taskCollection.find({ assignee: user.email })
        const parsedAssigneeTasks: number[] = assigneeTasks.map((task: TaskSchema) => task.id)

        return {
          email: user.email,
          password: user.password,
          reporterTasks: parsedReporterTaks,
          assigneeTasks: parsedAssigneeTasks,
        } as IUser
      }))
    } catch (e) {
      throw new GQLError(e)
    }
  }
};