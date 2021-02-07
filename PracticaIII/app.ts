import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL } from "https://deno.land/x/oak_graphql/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { Collection, Database, MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { types } from "./schema/types.ts"
import { TaskSchema } from "./mongo/mongoTypes.ts";
import { resolvers } from "./resolvers/resolvers.ts"

const app = new Application();
const port = Number(Deno.env.get("PORT")) || 8000

try {
  // connect to Mongo DB
  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  client.connectWithUri(DB_URL);
  const db: Database = client.database(DB_NAME);
  const taskCollection: Collection<TaskSchema> = db.collection<TaskSchema>("TaskCollection");

  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });

  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  });

  // In this case I only pass the taskCollection into the context because I only use that collection, in the case I use more collections i would pass the database instance
  const GraphQLService = await applyGraphQL<Router>({
    Router,
    path: "/graphql",
    typeDefs: types,
    resolvers: resolvers,
    context: (ctx: RouterContext) => {
      return {
        ctx,
        taskCollection
      };
    },
  });

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  console.log("Server start at http://localhost:8000");
  await app.listen({ port: port });
} catch (e) {
  console.log(e);
}
