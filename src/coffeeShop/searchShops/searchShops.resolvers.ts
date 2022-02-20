import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchShops: async (_, { keyword, lastId }, { client }) =>
      client.coffeeShop.findMany({
        where: {
          OR: [
            {
              description: {
                contains: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
            {
              categories: {
                some: {
                  name: {
                    contains: keyword.toLowerCase(),
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              address: {
                contains: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: { updatedAt: "desc" },
        skip: lastId ? 1 : 0,
        take: 36,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};

export default resolvers;
