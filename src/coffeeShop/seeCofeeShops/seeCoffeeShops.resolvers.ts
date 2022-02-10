import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShops: (_, { lastId }, { client }) =>
      client.coffeeShop.findMany({
        take: 2,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};

export default resolvers;
