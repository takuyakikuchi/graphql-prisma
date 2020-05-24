import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  // --------------------- User ---------------------
  // Create New User
  async createUser(parent, args, { prisma }, info) {
    return prisma.mutation.createUser({ data: args.data }, info);
  },

  // Delete User
  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },

  // Update User
  async updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser({
      where: { id: args.id },
      data: args.data,
      info,
    });
  },

  // --------------------- Post ---------------------
  // Create New Post
  async createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author,
            },
          },
        },
      },
      info
    );
  },

  // Delete Post & appended Comments
  async deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },

  async updatePost(parent, args, { prisma }, info) {
    return prisma.mutation.updatePost(
      {
        where: { id: args.id },
        data: args.data,
      },
      info
    );
  },

  // --------------------- Comment ---------------------
  // Create New Comment
  async createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author,
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

  // Delete Comment
  async deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id: args.id } }, info);
  },

  async updateComment(parent, args, { prisma }, info) {
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
