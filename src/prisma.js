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
    '{ id }'
  );

  const user = await prisma.query.user(
    {
      where: { id: userID },
    },
    '{ id name email posts { id title } }'
  );

  return user;
};

// createPost('ck9gm1i2t01fi0742svxb12op', {
//   title: 'Async post',
//   body: 'Async post',
//   published: true,
// });

const updatePost = async (postID, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data: { ...data },
      where: { id: postID },
    },
    '{ id author { id }}'
  );

  const user = await prisma.query.user(
    {
      where: { id: post.author.id },
    },
    '{ id name email }'
  );

  return user;
};

updatePost('ck9kqktzy00av0742mbpwk4x8', { body: 'Updated with async' }).then(
  (user) => {
    console.log(JSON.stringify(user, undefined, 2));
  }
);
