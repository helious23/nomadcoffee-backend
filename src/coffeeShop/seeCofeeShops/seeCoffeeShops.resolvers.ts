import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShops: (_, { page }, { client }) =>
      client.coffeeShop.findMany({
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};

export default resolvers;
