import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { TaskSchema, UserSchema } from "../mongo/mongoTypes.ts";
import { IContext, ITask } from "./resolversTypes.ts";

export const User = {
    reporterTasks: async (parent: { reporterTasks: number[] }, args: any, context: IContext): Promise<Array<ITask | undefined>> => {
        try {
            const db: Database = context.db
            const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")

            return await Promise.all(parent.reporterTasks.map(async (taskId: number) => {
                const task: TaskSchema | null = await taskCollection.findOne({ id: taskId })
                
                if (task) return {
                    ...task,
                    date: task.date.toString(),
                    reporter: task?.reporter,
                    assignee: task?.assignee,
                } as ITask
            }))
        } catch (e) {
            throw new GQLError(e)
        }
    },
    assigneeTasks: async (parent: { assigneeTasks: number[] }, args: any, context: IContext): Promise<Array<ITask | undefined>> => {
        try {
            const db: Database = context.db
            const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection")

            return await Promise.all(parent.assigneeTasks.map(async (taskId: number) => {
                const task: TaskSchema | null = await taskCollection.findOne({ id: taskId })
                
                if (task) return {
                    ...task,
                    date: task.date.toString(),
                    reporter: task?.reporter,
                    assignee: task?.assignee,
                } as ITask
            }))
        } catch (e) {
            throw new GQLError(e)
        }
    }
}