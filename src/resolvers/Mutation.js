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

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalState = { ...post };
    let mutation = 'UPDATED';

    if (!post) {
      throw new Error("Post with given ID doesn't exist.");
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;
      // published false => true
      if (post.published && !originalState.published) {
        mutation = 'CREATED';
      }
      // published true => false
      else if (!post.published && originalState.published) {
        mutation = 'DELETED';
      }
    }

    if (post) {
      pubsub.publish('post', {
        post: {
          mutation,
          data: post,
        },
      });
    }

    return post;
  },

  // --------------------- Comment ---------------------
  // Create New Comment
  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExist = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExist) {
      throw new Error("User doesn't exist.");
    } else if (!postExist) {
      throw new Error("Post doesn't exist or not published.");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    if (comment) {
      db.comments.push(comment);
      pubsub.publish(`comment ${args.data.post}`, {
        comment: {
          mutation: 'CREATED',
          data: comment,
        },
      });
    }

    return comment;
  },

  // Delete Comment
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment with the given ID doesn't exist.");
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    });
    return deletedComment;
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment with given ID doesn't exist.");
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: 'UPDATED',
          data: comment,
        },
      });
    }

    return comment;
  },
};

export { Mutation as default };
