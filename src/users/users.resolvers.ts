import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalShops: ({ id }, _, { client }) =>
      client.coffeeShop.count({ where: { userId: id } }),
    followers: ({ id }, { lastId }, { client }) =>
      client.user.findMany({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),

    followings: ({ id }, { lastId }, { client }) =>
      client.user.findMany({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),

    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),

    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),

    isFollowing: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exist = await client.user.count({
        where: {
          followers: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      });
      return Boolean(exist);
    },

    isMe: ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },

    shops: async ({ id }, { offset }, { client }) =>
      client.coffeeShop.findMany({
        where: {
          user: { id },
        },
        take: 36,
        skip: offset,
        orderBy: { updatedAt: "desc" },
      }),

    likedShops: async ({ id }, _, { client }) =>
      client.coffeeShop.findMany({
        where: {
          likes: {
            some: {
              userId: id,
            },
          },
        },
      }),
  },
};

export default resolvers;
