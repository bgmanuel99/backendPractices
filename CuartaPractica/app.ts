import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { Collection, Database, MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { schema } from "./schema/schema.ts"
import { resolvers } from "./resolvers/resolvers.ts"
import { UserSchema } from "./mongo/mongoTypes.ts";

const app = new Application();
const port = Number(Deno.env.get("PORT")) || 8000
let firstEntering: Boolean = true

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
  const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

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

  app.use(async (ctx, next) => {
    const value = await ctx.request.body().value
    const validQuery = ["login", "signin"]

    // If there is a token which does not equals null, as it can only be one user logged in at a time, it means that user is logged in
    const loggedinUser: UserSchema | null = await userCollection.findOne({ token: { $ne: null } })
    
    if (value && validQuery.some((elem) => value.query.includes(elem))) {
      await next();
    } else {
      // I have to use the firstEntering variable because everytime i first enter the playground the DDBB has no user with token, so i wouldnt be able to use it
      if (loggedinUser || firstEntering) {
        await next();
        firstEntering = false
      } else {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unathorized user" };
      }
    }
  })

  const GraphQLService = await applyGraphQL<Router>({
    Router,
    path: "/graphql",
    typeDefs: schema,
    resolvers: resolvers,
    context: (ctx: RouterContext) => {
      return {
        ctx,
        db
      };
    },
  });

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  console.log("Server start at http://localhost:8000");
  await app.listen({ port: port });
} catch (e) {
  console.log(e);
}