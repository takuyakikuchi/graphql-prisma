const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId,
              },
            },
          },
        },
        info
      );
      // const postExist = db.posts.find(
      //   (post) => post.id === postId && post.published
      // );

      // if (!postExist) {
      //   throw new Error("Post with given ID does not exist.");
      // }

      // return pubsub.asyncIterator(`comment ${postId}`);
    },
  },

  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    },
  },
};

export { Subscription as default };
