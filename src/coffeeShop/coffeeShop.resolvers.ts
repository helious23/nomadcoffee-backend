import { Resolvers } from "../types";

const resolvers: Resolvers = {
  CoffeeShop: {
    photos: ({ id }, _, { client }) =>
      client.coffeeShopPhoto.findMany({
        where: {
          shop: {
            id,
          },
        },
      }),
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({ where: { id: userId } }),
    likes: ({ id }, _, { client }) =>
      client.like.count({ where: { coffeeShopId: id } }),
    commentNumber: ({ id }, _, { client }) =>
      client.comment.count({ where: { coffeeShopId: id } }),
    comments: async ({ id }, { lastId }, { client }) =>
      client.comment.findMany({
        where: { coffeeShopId: id },
        take: 20,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: { createdAt: "desc" },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser, client }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          coffeeShopId_userId: {
            coffeeShopId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
    likedBy: async ({ id }, _, { loggedInUser, client }) =>
      client.user.findFirst({
        where: {
          likes: {
            some: {
              coffeeShopId: id,
            },
          },
          following: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
        select: {
          username: true,
          avatarURL: true,
        },
      }),
    averageRating: async ({ id }, _, { client }) => {
      const totalCommentsNumber = await client.comment.count({
        where: {
          shop: { id },
        },
      });
      const allComments = await client.comment.findMany({
        where: { shop: { id } },
        select: { rating: true },
      });
      let totalCommentsRating = 0;
      for (let i = 0; i < allComments.length; i++) {
        totalCommentsRating += allComments[i].rating;
      }
      if (totalCommentsRating === 0) {
        return 0;
      } else {
        const average = totalCommentsRating / totalCommentsNumber;
        return average.toFixed(2);
      }
    },
  },

  Category: {
    totalShops: ({ id }, _, { client }) =>
      client.coffeeShop.count({
        where: {
          categories: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
