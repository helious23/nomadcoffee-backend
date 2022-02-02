import { Resolvers } from "../types";
import client from "../client";

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
    user: ({ id }, _, { client }) =>
      client.user.findFirst({
        where: {
          shops: {
            some: {
              id,
            },
          },
        },
      }),
    categories: ({ id }, _, { client }) =>
      client.category.findMany({
        where: {
          shops: {
            some: {
              id,
            },
          },
        },
      }),
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
