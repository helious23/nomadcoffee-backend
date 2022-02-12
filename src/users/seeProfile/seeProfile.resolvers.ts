import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { id }, { client }) =>
      client.user.findUnique({
        where: {
          id,
        },
      }),
  },
};

export default resolvers;
