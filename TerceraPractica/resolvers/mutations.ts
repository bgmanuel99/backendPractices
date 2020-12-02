export const mutations = {
  addTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.input.id })
    
    if (finded) return { done: false }

    const insert = await context.taskCollection.insertOne({
      id: args.input.id,
      nombre: args.input.nombre,
      descripcion: args.input.descripcion,
      fechaDeFinalizacion: args.input.fechaDeFinalizacion,
      state: args.input.state,
    });

    if (insert) return { done: true }
    else return { done: false }
  },
  removeTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.id });

    if (!finded) return { done: false }

    const removed = await context.taskCollection.deleteOne({id: args.id})

    if (removed) return { done: true }
    else return { done: false }
  },
  updateTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.input.id });

    if (!finded) return { done: false }

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

    if (updated) return { done: true }
    else return { done: false }
  },
  completeTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.id });

    if (!finded) return { done: false }

    const completed = await context.taskCollection.updateOne(
      { id: args.id },
      {
        $set: {
          state: "DONE",
        },
      }
    );

    if (completed) return { done: true }
    else return { done: false }
  },
  startTask: async (parent: any, args: any, context: any, info: any) => {
    const finded = await context.taskCollection.findOne({ id: args.id });

    if (!finded) return { done: false }

    const started = await context.taskCollection.updateOne(
      { id: args.id },
      {
        $set: {
          state: "DOING",
        },
      }
    );

    if (started) return { done: true }
    else return { done: false }
  },
};