import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload, rating }, { loggedInUser, client }) => {
        const comment = await client.comment.findFirst({
          where: { id, userId: loggedInUser.id },
          select: { id: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: "댓글을 찾을 수 없습니다",
          };
        }
        const newComment = await client.comment.update({
          where: { id },
          data: {
            payload,
            rating,
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
