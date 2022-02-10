import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCategories: (_, __, { client }) => client.category.findMany(),
  },
};

export default resolvers;
