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

prisma.mutation
  .updatePost(
    // first argument
    {
      data: {
        body: 'Updated by prisma-binding v2',
      },
      where: {
        id: 'ck9kossfp005m0742mj3xb5up',
      },
    },
    // second argument
    '{id}'
  )
  .then((data) => {
    return prisma.query.posts(
      null,
      '{ id title body published author { id name }}'
    );
  })
  .then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
  });
