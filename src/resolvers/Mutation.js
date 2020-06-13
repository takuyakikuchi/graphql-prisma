import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getUserId } from '../utils/getUserId';

const Mutation = {
  // --------------------- User ---------------------

  async createUser(parent, args, { prisma }, info) {
    // Validation
    if (args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer.');
    }

    const password = await bcrypt.hash(args.data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret'),
    };
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    // Email check
    if (!user) {
      throw new Error('User does not exist with the given email.');
    }

    // Password check
    await bcrypt.compare(args.data.password, user.password).then((res) => {
      if (!res) {
        throw new Error('Wrong password');
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret'),
    };
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.updateUser({
      where: { id: userId },
      data: args.data,
      info,
    });
  },

  // --------------------- Post ---------------------
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isPostExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!isPostExist) {
      throw new Error("The provided Post doesn't exist!");
    }

    return prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isPostExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!isPostExist) {
      throw new Error("The provided Post doesn't exist!");
    }

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (isPublished && args.data.published === false) {
      prisma.mutation.deleteManyComments(
        {
          where: {
            post: {
              id: args.id,
            },
          },
        },
        info
      );
    }

    return prisma.mutation.updatePost(
      {
        where: { id: args.id },
        data: args.data,
      },
      info
    );
  },

  // --------------------- Comment ---------------------
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isPublished = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!isPublished) {
      throw new Error('The post is not published!');
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isCommentExist = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!isCommentExist) {
      throw new Error("The provided comment doesn't exist!");
    }

    return prisma.mutation.deleteComment({ where: { id: args.id } }, info);
  },

  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isCommentExist = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!isCommentExist) {
      throw new Error("The provided comment doesn't exist!");
    }

    return prisma.mutation.updateComment(
      {
        where: { id: args.id },
        data: args.data,
      },
      info
    );
  },
};

export { Mutation as default };
