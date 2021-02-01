import { gql } from "https://deno.land/x/oak_graphql/mod.ts"

export const schema = gql`
  type User{
    email: String!
    role: String!
    token: String!
    car: Car
    journey: [Journey!]!
  }

  type Car {
    driver: User!
    enrollment: String!
    available: Boolean!
  }

  type Journey {
    id: String!
    driver: User!
    client: User!
    car: Car!
  }

  input UserInput {
    email: String!
    role: String!
    password: String!
  }

  type Query {
    getJourneys: [Journey!]!
    getCars: [Car!]!
    getDrivers: [User!]!
    getClients: [User!]!
  }

  type Mutation {
    addUser(input: UserInput!): User!
    login(email: String!, password: String!): User!
    logout: Boolean!
    addCar(enrollment: String!): Boolean!
    setAvailability(av: Boolean!): Boolean!
    rentCar: Journey!
  }
`;