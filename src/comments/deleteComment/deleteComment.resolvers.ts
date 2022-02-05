import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const comment = await client.comment.findFirst({
          where: { id, userId: loggedInUser.id },
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: "댓글을 찾을 수 없습니다",
          };
        }
        await client.comment.delete({ where: { id } });
        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
