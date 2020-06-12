import Comment from './Comment';
import Mutation from './Mutation';
import Post from './Post';
import Query from './Query';
import Subscription from './Subscription';
import User from './User';

import { extractFragmentReplacements } from 'prisma-binding';

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Comment,
  Post,
  User,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
