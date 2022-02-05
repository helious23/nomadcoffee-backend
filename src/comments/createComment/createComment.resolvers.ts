import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { shopId, payload, rating }, { client, loggedInUser }) => {
        const shop = await client.coffeeShop.findUnique({
          where: { id: shopId },
          select: { id: true },
        });
        if (!shop) {
          return {
            ok: false,
            error: "카페를 찾을 수 없습니다.",
          };
        }
        const newComment = await client.comment.create({
          data: {
            payload,
            rating,
            shop: {
              connect: { id: shop.id },
            },
            user: {
              connect: { id: loggedInUser.id },
            },
          },
        });
        return {
          ok: true,
          id: newComment.id,
        };
      }
    ),
  },
};

export default resolvers;
