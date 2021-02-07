// @ts-ignore
import { Application } from "https://deno.land/x/oak@v6.3.1/mod.ts";
// @ts-ignore
import "https://deno.land/x/dotenv/load.ts";
// @ts-ignore
import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
// @ts-ignore
import router from "./routes.ts"

try{
    // connect to Mongo DB
    const DB_URL = Deno.env.get("DB_URL");
    const DB_NAME = Deno.env.get("DB_NAME");

    if (!DB_URL || !DB_NAME) {
      throw Error("Please define DB_URL and DB_NAME on .env file");
    }

    const client = new MongoClient();
    client.connectWithUri(DB_URL);
    const db = client.database(DB_NAME);

    // launch server
    const app: Application = new Application();

    // Pass de DB to the context.
    app.use(async (ctx, next) => {
      ctx.state.db = db;
      await next();
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    const PORT: number = Number(Deno.env.get("PORT")) || 8000;
    console.log(`Listening on port ${PORT}...`);
    await app.listen({ port: PORT });
}catch (e){
  console.error(e);
}