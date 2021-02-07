import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { TaskSchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext, IIdArgs } from "./resolversTypes.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface IAddTaskArgs {
  input: {
    id: number;
    name: string;
    description?: string;
    year: number;
    month: number;
    day: number;
    state: string;
    assignee_mail: string;
  };
}

interface IUpdateTaskArgs {
  input: {
    id: number;
    name: string;
    description?: string;
    year: number;
    month: number;
    day: number;
    state: string;
  }
}

interface IAddLoginUserArgs {
  input: {
    email: string;
    password: string;
  }
}

export const mutations = {
  addTask: async (parent: any, args: IAddTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
      
      const { id, name, description, year, month, day, state, assignee_mail } = args.input
      
      const assignee: UserSchema | null = await userCollection.findOne({ email: assignee_mail })
      if(!assignee) throw new GQLError("There is no assignee with the specified email")

      const task: TaskSchema | null = await taskCollection.findOne({ id: id })
      if (task) throw new GQLError("There is already a task with that id in the DDBB")

      const inserted = await taskCollection.insertOne({
        id: id,
        name: name,
        description: description,
        date: new Date(year, month, day),
        state: state,
        reporter: context.user.email,
        assignee: assignee_mail,
      });

      if (inserted) return true
      else throw new GQLError("There was a problem inserting the task into the DDBB")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  removeTask: async (parent: any, args: IIdArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const task: TaskSchema | null = await taskCollection.findOne({ id: args.id })
      if (!task) throw new GQLError("There is no task inside the DDBB with that id")
      
      if(task.reporter !== context.user.email) throw new GQLError("You are not the repoter of the task, you cannot delete it")

      const removed = await taskCollection.deleteOne({ id: args.id })

      if (removed) return true
      else throw new GQLError("There was a problem deleting the task")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  updateTask: async (parent: any, args: IUpdateTaskArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")

      const { id, name, description, year, month, day, state } = args.input
      
      const task: TaskSchema | null = await taskCollection.findOne({ id: id });
      if (!task) throw new GQLError("There is no task inside the DDBB with that id")

      if ((task.reporter !== context.user.email) && (task.assignee !== context.user.email))
        throw new GQLError("You are not the reporter nor the assignee of the task, so you cannot update it")

      const updated = await taskCollection.updateOne(
        { id: id },
        {
          $set: {
            name: name,
            description: description,
            date: new Date(year, month, day),
            state: state,
          },
        }
      );

      if (updated) return true
      else throw new GQLError("There was a problem updating the task in the DDBB")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  completeTask: async (parent: any, args: IIdArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const task: TaskSchema | null = await taskCollection.findOne({ id: args.id });
      if (!task) throw new GQLError("There is no task inside the DDBB with that id")

      if(task.assignee !== context.user.email) throw new GQLError("You are not the assignee of the task, you cannot change it to the complete state")

      const completed = await taskCollection.updateOne({ id: args.id }, { state: "DONE" });

      if (completed) return true
      else throw new GQLError("There was a problem updating the task to the state DONE")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  startTask: async (parent: any, args: IIdArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
      
      const task: TaskSchema | null = await taskCollection.findOne({ id: args.id });
      if (!task) throw new GQLError("There is no task inside the DDBB with that id")

      if(task.assignee !== context.user.email) throw new GQLError("You are not the assignee of the task, you cannot change it to the start state")

      const started = await taskCollection.updateOne({ id: args.id }, { state: "DOING" });

      if (started) return true
      else throw new GQLError("There was a problem updating the task to the state DOING")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  signin: async (parent: any, args: IAddLoginUserArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const { email, password } = args.input

      const user: UserSchema | null = await userCollection.findOne({ email: email })
      if (user) throw new GQLError("There is already a user with that email inside the DDBB")
      
      const inserted = await userCollection.insertOne({email: email, password: password, token: ""})

      if (inserted) return true
      else throw new GQLError("There was a problem inserting the user into the DDBB")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  login: async (parent: any, args: IAddLoginUserArgs, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const { email, password } = args.input

      const user: UserSchema | null = await userCollection.findOne({ $and: [{ email: email }, { password: password }] })
      if (!user) throw new GQLError("Wrong email or password")
      
      // This generate a random token for the user
      const token = v4.generate()
      
      const updatedToken = await userCollection.updateOne({ email: user.email }, { $set: { token: token} })
        
      if (updatedToken) return true
      else throw new GQLError("There was a problem logging in the user")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  logout: async (parent: any, args: any, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const user: UserSchema | null = await userCollection.findOne({ email: context.user.email, token: context.user.token })
      if(!user) throw new GQLError("Unexpected error")
      
      const updatedToken = await userCollection.updateOne({ email: context.user.email }, { $set: { token: ""} })

      if (updatedToken) return true
      else throw new GQLError("There was a problem logging out the user")
    } catch (e) {
      throw new GQLError(e)
    }
  },
  deleteAccount: async (parent: any, args: any, context: IContext): Promise<Boolean> => {
    try {
      const db: Database = context.db
      const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

      const user: UserSchema | null = await userCollection.findOne({ email: context.user.email, token: context.user.token })
      if(!user) throw new GQLError("Unexpected error")
      
      const deleted = await userCollection.deleteOne({ email: context.user.email })
      
      if (deleted) return true
      else throw new GQLError("There was a problem deleting the account")
    } catch (e) {
      throw new GQLError(e)
    }
  }
};