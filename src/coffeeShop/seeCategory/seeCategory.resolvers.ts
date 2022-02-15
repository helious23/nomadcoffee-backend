import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCategory: (_, { categoryName, page }, { client }) =>
      client.coffeeShop.findMany({
        where: {
          categories: {
            some: {
              slug: {
                contains: categoryName,
              },
            },
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};

export default resolvers;
