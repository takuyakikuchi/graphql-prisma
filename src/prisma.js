import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

// --------------- query ---------------
// prisma.query.users(null, '{ id name email posts { id title }}').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{ id text author { id name }}').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// --------------- mutation ---------------
// --- promise ---
// prisma.mutation
//   .createPost(
//     // first argument
//     {
//       data: {
//         title: 'New post from prisma-binding',
//         body: 'New post from prisma-binding',
//         published: true,
//         author: {
//           connect: {
//             id: 'ck9gjc06700dt0742plugk2qo',
//           },
//         },
//       },
//     },
//     // second argument
//     '{id title body published}'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost(
//     // first argument
//     {
//       data: {
//         body: 'Updated by prisma-binding v2',
//       },
//       where: {
//         id: 'ck9kossfp005m0742mj3xb5up',
//       },
//     },
//     // second argument
//     '{id}'
//   )
//   .then((data) => {
//     return prisma.query.posts(
//       null,
//       '{ id title body published author { id name }}'
//     );
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// --- async ---
const createPost = async (userID, data) => {
  const userExists = await prisma.exists.User({ id: userID });

  if (!userExists) {
    throw new Error("Given user doesn't exist");
  }

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: userID,
          },
        },
      },
    },
    '{ author { name posts { id title } } }'
  );

  return user.author;
};

// createPost('ck9gm1i2t01fi0742svxb12op', {
//   title: 'After Exist check v2',
//   body: 'After Exist check v2',
//   published: true,
// })
//   .then((userID) => {
//     console.log(JSON.stringify(userID, undefined, 2));
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

const updatePost = async (postID, data) => {
  const postExists = await prisma.exists.Post({ id: postID });

  if (!postExists) {
    throw new Error("Given post ID doesn't exist");
  }

  const post = await prisma.mutation.updatePost(
    {
      data: { ...data },
      where: { id: postID },
    },
    '{ author { id name }}'
  );

  return post.author;
};

// updatePost('ck9kxadpi011h0742jw7n77jn', { body: 'Post exists check' })
//   .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });
