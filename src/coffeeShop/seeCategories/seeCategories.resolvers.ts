import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCategories: (_, { page }, { client }) =>
      client.category.findMany({
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};

export default resolvers;
