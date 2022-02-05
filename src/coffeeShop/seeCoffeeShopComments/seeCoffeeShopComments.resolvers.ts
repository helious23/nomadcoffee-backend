import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShopComments: async (_, { lastId, id }, { client }) =>
      client.comment.findMany({
        where: {
          coffeeShopId: id,
        },
        include: {
          user: true,
          shop: true,
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: {
          updatedAt: "desc",
        },
      }),
  },
};
export default resolvers;
