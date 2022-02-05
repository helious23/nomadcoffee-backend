import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const coffeeShop = await client.coffeeShop.findUnique({
          where: { id },
          select: { id: true },
        });
        if (!coffeeShop) {
          return {
            ok: false,
            error: "카페를 찾을 수 없습니다",
          };
        }
        const like = await client.like.findUnique({
          where: {
            coffeeShopId_userId: {
              userId: loggedInUser.id,
              coffeeShopId: id,
            },
          },
        });
        if (like) {
          await client.like.delete({
            where: {
              coffeeShopId_userId: {
                userId: loggedInUser.id,
                coffeeShopId: id,
              },
            },
          });
        } else {
          await client.like.create({
            data: {
              user: {
                connect: { id: loggedInUser.id },
              },
              shop: {
                connect: { id: coffeeShop.id },
              },
            },
          });
        }
        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
