import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { TaskSchema } from "../mongo/mongoTypes.ts";
import { IContext, ITask, IUser } from "./resolversTypes.ts";

export const User = {
    reporterTasks: async (parent: IUser, args: any, context: IContext): Promise<ITask[] | null> => {
        try {
            const db: Database = context.db
            const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")

            const tasks = await taskCollection.find({ reporter: parent.email })
            
            return tasks.map(task => {
                return {
                    ...task,
                    date: task.date.toString()
                }
            })
        } catch (e) {
            throw new GQLError(e)
        }
    },
    assigneeTasks: async (parent: IUser, args: any, context: IContext): Promise<ITask[] | null> => {
        try {
            const db: Database = context.db
            const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")

            const tasks = await taskCollection.find({ assignee: parent.email });

            return tasks.map((task) => {
              return {
                ...task,
                date: task.date.toString(),
              };
            });
        } catch (e) {
            throw new GQLError(e)
        }
    }
}