import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
      const user = await client.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          password: true,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: "사용자를 찾을 수 없습니다.",
        };
      }
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return {
          ok: false,
          error: "비밀번호가 맞지 않습니다.",
        };
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        ok: true,
        token,
      };
    },
  },
};

export default resolvers;
