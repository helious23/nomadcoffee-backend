import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { deleteS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
  Mutation: {
    deleteCoffeeShopPhoto: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const ok = await client.coffeeShopPhoto.findFirst({
          where: {
            id,
            shop: {
              userId: loggedInUser.id,
            },
          },
          select: {
            shop: {
              select: { slug: true },
            },
            url: true,
          },
        });
        if (!ok) {
          return {
            ok: false,
            error: "사진이 존재하지 않습니다.",
          };
        }
        await deleteS3(ok.url, loggedInUser.username, ok.shop.slug);
        await client.coffeeShopPhoto.delete({
          where: {
            id,
          },
        });
        return {
          ok: true,
          id,
        };
      }
    ),
  },
};

export default resolvers;
