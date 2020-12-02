import { TaskSchema } from "../types.ts"

export const querys = {
  getTask: async (parent: any, args: any, context: any, info: any) => {
    const task = await context.taskCollection.findOne({ id: args.id })
    
    if (task) return task
    else return undefined
  },
  getTasks: async (parent: any, args: any, context: any, info: any) => {
    const tasks = await context.taskCollection.find({ id: { $gte: 1 } })

    return tasks
  },
  getTaskByState: async (parent: any, args: any, context: any, info: any) => {
    const tasks = await context.taskCollection.find({ state: args.state })

    return tasks
  },
  getTaskByDate: async (parent: any, args: any, context: any, info: any) => {
    const tasks = await context.taskCollection.find({ fechaDeFinalizacion: { $lt: args.fecha } })

    return tasks;
  },
};