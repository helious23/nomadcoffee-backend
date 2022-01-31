import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleFollow: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        const exist = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!exist) return { ok: false, error: "사용자를 찾을 수 없습니다." };

        const currentFollowing = await client.user.findFirst({
          where: {
            id: loggedInUser.id,
            following: {
              some: {
                username,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!currentFollowing) {
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                connect: {
                  username,
                },
              },
            },
          });
        } else {
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                disconnect: {
                  username,
                },
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
