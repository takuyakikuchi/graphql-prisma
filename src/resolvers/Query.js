import { getUserId } from '../utils/getUserId';

const Query = {
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },

  posts(parent, args, { prisma }, info) {
    const operationArgs = {};

    if (args.query) {
      operationArgs.where = {
        OR: [
          {
            title_contains: args.query,
          },
          {
            body_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.posts(operationArgs, info);

    // if (!args.query) return db.posts;

    // return db.posts.filter((post) => {
    //   const titleMatched = post.title
    //     .toLowerCase()
    //     .includes(args.query.toLowerCase());

    //   const bodyMatched = post.body
    //     .toLowerCase()
    //     .includes(args.query.toLowerCase());

    //   return titleMatched || bodyMatched;
    // });
  },

  users(parent, args, { prisma }, info) {
    const operationArgs = {};

    if (args.query) {
      operationArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(null, info);
  },

  async post(parent, args, { prisma, request }, info) {
    // Second argument is for throwing error when there is no userId
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true,
            },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      },
      info
    );

    if (posts.length === 0) {
      throw new Error('Post not found');
    }

    return posts[0];
  },
};

export { Query as default };
