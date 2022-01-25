import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { username, name, password, email },
      { client }
    ) => {
      try {
        const existingUsername = await client.user.findUnique({
          where: {
            username,
          },
        });
        if (existingUsername) {
          return {
            ok: false,
            error: "이미 존재하는 사용자 이름 입니다.",
          };
        }
        const existingEmail = await client.user.findUnique({
          where: {
            email,
          },
        });
        if (existingEmail) {
          return {
            ok: false,
            error: "이미 가입된 이메일 입니다.",
          };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            name,
            password: hashedPassword,
            email,
          },
        });
        return {
          ok: true,
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          error: "새 계정을 만들 수 없습니다.",
        };
      }
    },
  },
};

export default resolvers;
