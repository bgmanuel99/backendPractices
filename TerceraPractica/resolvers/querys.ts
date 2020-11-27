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
    const tasks = await context.taskCollection.find({ id: { $gte: 1 } })

    // This if statement is to see if there was a problem fetching the data
    if(tasks.length === 0) return tasks

    // Here I check which tasks should be done before the date I pass in the argument, to do that i submit the arguments date and the task date and if the
    // number(given in milliseconds) is more than cero then it means it has to be done before, in case is less it have more time to be done and I return null
    let parsedTasks: (TaskSchema | null)[] = tasks.map((task: TaskSchema) => {
      if (Date.parse(args.fecha) - Date.parse(task.fechaDeFinalizacion) > 0) return task
      else return null
    })

    // There are cases in which the array of tasks could cotain nulls so I remove them from the array
    for (let i = 0; i < parsedTasks.length; i++) {
      if(!parsedTasks[i]) parsedTasks.splice(i, 1)
    }

    if (parsedTasks[0] !== null) return parsedTasks
    else return []
  },
};