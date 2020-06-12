// External libraries
import { GraphQLServer, PubSub } from 'graphql-yoga';

// Internal
import db from './db';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers/index';

// Subscription
const pubsub = new PubSub();

// Server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      db,
      prisma,
      pubsub,
      request,
    };
  },
  fragmentReplacements,
});

server.start(() => {
  console.log('The server is up!');
});
