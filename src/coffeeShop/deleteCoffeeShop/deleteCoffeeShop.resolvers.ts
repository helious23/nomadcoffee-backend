import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { deleteS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
  Mutation: {
    deleteCoffeeShop: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const ok = await client.coffeeShop.findFirst({
          where: { id, userId: loggedInUser.id },
          select: { id: true, photos: true, slug: true },
        });
        if (!ok) {
          return {
            ok: false,
            error: "카페를 찾을 수 없습니다.",
          };
        }
        ok.photos.map((photo) =>
          deleteS3(photo.url, loggedInUser.username, ok.slug)
        );
        await client.coffeeShop.delete({ where: { id } });
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
