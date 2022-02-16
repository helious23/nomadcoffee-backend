import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShops: (_, { offset }, { client }) =>
      client.coffeeShop.findMany({
        take: 10,
        skip: offset,
        orderBy: { updatedAt: "desc" },
      }),
  },
};

export default resolvers;
