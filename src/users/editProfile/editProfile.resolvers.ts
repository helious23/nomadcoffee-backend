import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";
import * as bcrypt from "bcrypt";
import { uploadToS3, deleteS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          username,
          name,
          email,
          password: newPassword,
          location,
          avatarURL,
          githubUsername,
        },
        { client, loggedInUser }
      ) => {
        try {
          let hashedPassword: string = null;
          if (newPassword) {
            const samePassword = await bcrypt.compare(
              newPassword,
              loggedInUser.password
            );
            if (samePassword) {
              return {
                ok: false,
                error: "동일한 비밀번호로 변경할 수 없습니다.",
              };
            }
            hashedPassword = await bcrypt.hash(newPassword, 10);
          }

          if (username) {
            if (username !== loggedInUser.username) {
              const existUsername = await client.user.findUnique({
                where: { username },
                select: { id: true },
              });
              if (existUsername) {
                return {
                  ok: false,
                  error: "이미 사용중인 사용자 이름 입니다.",
                };
              }
            }
          }

          if (email) {
            if (email !== loggedInUser.email) {
              const existingEmail = await client.user.findUnique({
                where: {
                  email,
                },
              });
              if (existingEmail) {
                return {
                  ok: false,
                  error: "이미 사용중인 이메일 입니다.",
                };
              }
            }
          }

          if (avatarURL) {
            if (loggedInUser.avatarURL) {
              const existUrl = loggedInUser["avatarURL"];
              await deleteS3(existUrl, loggedInUser.username, "avatars");
            }
            avatarURL = await uploadToS3(
              avatarURL,
              loggedInUser.username,
              "avatars"
            );
          }

          const updatedUser = await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              username,
              name,
              email,
              location,
              githubUsername,
              ...(avatarURL && { avatarURL }),
              ...(hashedPassword && { password: hashedPassword }),
            },
            select: {
              id: true,
            },
          });

          if (updatedUser.id) {
            return {
              ok: true,
            };
          } else {
            return {
              ok: false,
              error: "프로필 수정을 할 수 없습니다.",
            };
          }
        } catch (error) {
          console.log(error);
          return {
            ok: false,
            error: "프로필 수정을 할 수 없습니다.",
          };
        }
      }
    ),
  },
};

export default resolvers;
