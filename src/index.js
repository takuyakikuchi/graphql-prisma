// External libraries
import { GraphQLServer, PubSub } from "graphql-yoga";

// Internal
import "./prisma";
import Comment from "./resolvers/Comment";
import db from "./db";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";

// Subscription
const pubsub = new PubSub();

// Server
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Comment,
    Post,
    User,
  },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log("The server is up!");
});
