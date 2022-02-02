import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShop: (_, { id }, { client, loggedInUser }) =>
      client.coffeeShop.findUnique({ where: { id } }),
  },
};

export default resolvers;
