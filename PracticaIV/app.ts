import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { Collection, Database, MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { schema } from "./schema/schema.ts"
import { resolvers } from "./resolvers/resolvers.ts"
import { UserSchema } from "./mongo/mongoTypes.ts";

const app = new Application();
const port = Number(Deno.env.get("PORT")) || 8000

try {
  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  client.connectWithUri(DB_URL);
  const db: Database = client.database(DB_NAME);

  app.use(async (ctx, next) => {
    const value = await ctx.request.body().value
    
    if (!value || value.operationName === "IntrospectionQuery") {
      await next()
    } else {
      const validQuery: string[] = ["login", "signin"]

      if (value && validQuery.some((elem) => value.query.includes(elem))) {
        await next();
      } else {
        const token = ctx.request.headers.get("token") || "none"
        const email = ctx.request.headers.get("email") || "none"
        const user: UserSchema | null = await db.collection<UserSchema>("UserCollection").findOne({token, email})

        if (user) {
          ctx.state.user = user
          await next();
        } else {
          ctx.response.status = 401;
          ctx.response.body = { error: "Unathorized user" };
        }
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
        db,
        user: ctx.state.user
      };
    },
  });

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  console.log("Server start at http://localhost:8000");
  await app.listen({ port: port });
} catch (e) {
  console.log(e);
}