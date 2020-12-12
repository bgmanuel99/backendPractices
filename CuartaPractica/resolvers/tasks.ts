import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { TaskSchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext, IUser } from "./resolversTypes.ts";

export const Task = {
    reporter: async (parent: { reporter: string }, args: any, context: IContext): Promise<IUser | null> => {
        try {
            const db: Database = context.db
            const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: parent.reporter })

            const reporterTasks: TaskSchema[] = await taskCollection.find({ reporter: user?.email })
            const parsedReporterTaks: number[] = reporterTasks.map((task: TaskSchema) => task.id)
            
            const assigneeTasks: TaskSchema[] = await taskCollection.find({ assignee: user?.email })
            const parsedAssigneeTasks: number[] = assigneeTasks.map((task: TaskSchema) => task.id)
            
            return {
                email: user?.email,
                password: user?.password,
                reporterTasks: parsedReporterTaks,
                assigneeTasks: parsedAssigneeTasks
            }
        } catch (e) {
            throw new GQLError(e)
        }
    },
    assignee: async (parent: { assignee: string }, args: any, context: IContext): Promise<IUser | null> => {
        try {
            const db: Database = context.db
            const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: parent.assignee })
            
            const reporterTasks: TaskSchema[] = await taskCollection.find({ reporter: user?.email })
            const parsedReporterTaks: number[] = reporterTasks.map((task: TaskSchema) => task.id)
            
            const assigneeTasks: TaskSchema[] = await taskCollection.find({ assignee: user?.email })
            const parsedAssigneeTasks: number[] = assigneeTasks.map((task: TaskSchema) => task.id)
            
            return {
                email: user?.email,
                password: user?.password,
                reporterTasks: parsedReporterTaks,
                assigneeTasks: parsedAssigneeTasks
            }
        } catch (e) {
            throw new GQLError(e)
        }
    }
}