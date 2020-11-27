export const mutations = {
  addTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.input.id })
    
    if (finded) return "There is already a task with that ID in the DDBB"

    const insert = await context.taskCollection.insertOne({
      id: args.input.id,
      nombre: args.input.nombre,
      descripcion: args.input.descripcion,
      fechaDeFinalizacion: args.input.fechaDeFinalizacion,
      state: args.input.state,
    });

    if (insert) return "The task has been succesfully inserted into DDBB";
    else return "There was a problem introducing the task into the DDBB";
  },
  removeTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.id });

    if (!finded) return "There is no task with that ID in the DDBB";

    const removed = await context.taskCollection.deleteOne({id: args.id})

    if (removed) return "The task has been removed from the DDBB";
    else return "There was a problem removing the task form the DDBB";
  },
  updateTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.input.id });

    if (!finded) return "There is no task with that ID in the DDBB";

    const updated = await context.taskCollection.updateOne(
      { id: args.input.id },
      {
        $set: {
          nombre: args.input.nombre,
          descripcion: args.input.descripcion,
          fechaDeFinalizacion: args.input.fechaDeFinalizacion,
          state: args.input.state,
        },
      }
    );

    if (updated) return "The task has been updated in the DDBB with the new parameters";
    else return "Thre was a problem updating the task in the DDBB";
  },
  completeTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.id });

    if (!finded) return "There is no task with that ID in the DDBB";

    const completed = await context.taskCollection.updateOne(
      { id: args.id },
      {
        $set: {
          state: "DONE",
        },
      }
    );

    if (completed) return "The task has been completed";
    else return "There was a problem changing the state of the task";
  },
  startTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.id });

    if (!finded) return "There is no task with that ID in the DDBB";

    const started = await context.taskCollection.updateOne(
      { id: args.id },
      {
        $set: {
          state: "DOING",
        },
      }
    );

    if (started) return "The task has been started";
    else return "There was a problem changing the state of the task";
  },
};