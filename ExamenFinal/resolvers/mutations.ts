import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { UserSchema, CarSchema, JourneySchema } from "../mongo/mongoTypes.ts";
import { IContext } from "./resolversTypes.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface IAddUserArgs {
    input: {
        email: string;
        role: string;
        password: string;
    }
}

interface ILoginUserArgs {
    email: string;
    password: string;
}

interface ISetAvailabilityArgs {
    av: boolean;
}

interface IAddCarArgs {
    enrollment: string;
}

export const mutations = {
    addCar: async (parent: any, args: IAddCarArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            const carCollection: Collection<CarSchema> = db.collection<CarSchema>("CarCollection")
            
            const user: UserSchema | null = await userCollection.findOne({ email: context.user.email })
            if (!user) throw new GQLError("This should not happen")
            
            const car: CarSchema | null = await carCollection.findOne({ enrollment: args.enrollment })
            if (car) throw new GQLError("There is a car with that enrollment already in the DDBB")

            const alreadyHaveACar: CarSchema | null = await carCollection.findOne({ driver: context.user.email })
            if(alreadyHaveACar) throw new GQLError("You already have a car")

            const inserted = await carCollection.insertOne({
                enrollment: args.enrollment,
                driver: context.user.email,
                available: true,
            })

            if (inserted) return true
            else throw new GQLError("There was a problem inserting the car in the DDBB")
        } catch (e) {
            throw new GQLError(e.message);
        }
    },
    rentCar: async (parent: any, args: any, context: IContext): Promise<JourneySchema> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            const carCollection: Collection<CarSchema> = db.collection<CarSchema>("CarCollection")
            const journeyCollection: Collection<JourneySchema> = db.collection<JourneySchema>("JourneyCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: context.user.email })
            if (!user) throw new GQLError("This should not happen")
            
            const car: CarSchema | null = await carCollection.findOne({ available: true })
            if (!car) throw new GQLError("There are no available cars")

            const update = await carCollection.updateOne({ enrollment: car?.enrollment }, { $set: { available: false }})
            
            if (!update) throw new GQLError("There was a problem updating the car")

            const token = v4.generate();

            const journey = {
              id: token,
              client: context.user.email,
              driver: car.driver,
              car: car.enrollment,
            } as JourneySchema;
            
            const inserted = await journeyCollection.insertOne(journey)

            if (inserted) return journey
            else throw new GQLError("There was a problem inserting the journey in the DDBB")
        } catch (e) {
            throw new GQLError(e);
        }
    },
    setAvailability: async (parent: any, args: ISetAvailabilityArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            const carCollection: Collection<CarSchema> = db.collection<CarSchema>("CarCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: context.user.email })
            if (!user) throw new GQLError("This should not happen")
            
            const car: CarSchema | null = await carCollection.findOne({ driver: context.user.email })
            if (!car) throw new GQLError("You dont have a car")
            
            const updated = await carCollection.updateOne({ driver: context.user.email }, { $set: { available: args.av }})
            
            if (updated) return true
            else throw new GQLError("There was a problem changing the DDBB")
        } catch (e) {
            throw new GQLError(e);
        }
    },
    addUser: async (parent: any, args: IAddUserArgs, context: IContext): Promise<UserSchema> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const { email, role, password } = args.input

            const user: UserSchema | null = await userCollection.findOne({ email: email })
            if (user) throw new GQLError("There is already a user inside the DDBB with that email")

            if(!["CLIENT", "DRIVER", "ADMIN"].includes(role)) throw new GQLError("The specified role is wrong")

            const newUser = {
                email: email,
                role: role,
                password: password,
                token: "",
            } as UserSchema
            
            const inserted = await userCollection.insertOne(newUser)

            if (inserted) return newUser
            else throw new GQLError("There was a problem inserting the user into the DDBB")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    login: async (parent: any, args: ILoginUserArgs, context: IContext): Promise<UserSchema> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const email = args.email
            const password = args.password

            const user: UserSchema | null = await userCollection.findOne({ $and: [{ email: email }, { password: password }] })
            if (!user) throw new GQLError("Wrong email or password")

            const token = v4.generate()
            
            const updatedToken = await userCollection.updateOne({ email: email }, { $set: { token: token} })
                
            if (updatedToken) return {
                ...user,
                token: token
            }as UserSchema
            else throw new GQLError("There was a problem logging in the user")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    logout: async (parent: any, args: any, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: context.user.email, token: context.user.token })
            if(!user) throw new GQLError("Unexpected error")
            
            const updatedToken = await userCollection.updateOne({ email: context.user.email }, { $set: { token: ""} })

            if (updatedToken) return true
            else throw new GQLError("There was a problem logging out the user")
        } catch (e) {
            throw new GQLError(e)
        }
    }
}