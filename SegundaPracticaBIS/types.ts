// @ts-ignore
import { Context } from "https://deno.land/x/oak@v6.3.1/mod.ts"

// Mongo Schemas
export interface CarSchema {
  _id: { $oid: string },
  id: number,
  seats: number,
  occupied: boolean,
}

export interface JourneySchema {
  id: number,
  people: number,
  car: CarSchema,
}

// deno-lint-ignore no-explicit-any
export type IContext = Context<Record<string, any>>