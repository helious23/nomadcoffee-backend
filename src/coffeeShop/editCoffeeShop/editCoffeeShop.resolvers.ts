import { uploadToS3, deleteS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { getOrCreate, processCategories } from "../coffeeShop.utils";

const resolvers: Resolvers = {
  Mutation: {
    editCoffeeShop: protectedResolver(
      async (
        _,
        { id, name, latitude, longitude, categories, photos, description },
        { client, loggedInUser }
      ) => {
        const coffeeShop = await client.coffeeShop.findFirst({
          where: { id, userId: loggedInUser.id },
          include: { categories: { select: { slug: true } } },
        });
        if (!coffeeShop) {
          return {
            ok: false,
            error: "카페를 찾을 수 없습니다.",
          };
        }

        let editedCoffeeShopSlug = undefined;
        if (name) {
          const editedCoffeeShopName = name.trim().toLowerCase();
          editedCoffeeShopSlug = editedCoffeeShopName.replace(/ +/g, "-");
          // s3 폴더 이름 변경 (기존 폴더 새 폴더명으로 복사 후 삭제)
        }

        let categoryObj = [];
        if (categories) {
          categoryObj = await Promise.all(await getOrCreate(categories));
        }

        const editedCoffeeShop = await client.coffeeShop.update({
          where: { id },
          data: {
            name,
            latitude,
            longitude,
            description,
            slug: editedCoffeeShopSlug,
            categories: {
              disconnect: coffeeShop.categories,
              connectOrCreate: processCategories(categoryObj),
            },
          },
        });

        const oldPhotos = await client.coffeeShopPhoto.findMany({
          where: { coffeeShopId: id },
        });
        let coffeeShopPhotos = [];
        if (photos) {
          // 삭제 resolver 따로 구현함. 기존 사진 삭제 시 사용
          // 사진 바꿀 경우 기존 사진 모두 삭제 후 업로드
          for (let i = 0; i < oldPhotos.length; i++) {
            await deleteS3(
              oldPhotos[i].url,
              loggedInUser.username,
              `${editedCoffeeShopSlug ? editedCoffeeShopSlug : coffeeShop.slug}`
            );
            await client.coffeeShopPhoto.delete({
              where: {
                id: oldPhotos[i].id,
              },
            });
          }

          for (let i = 0; i < photos.length; i++) {
            const photoUrl = await uploadToS3(
              photos[i],
              loggedInUser.username,
              `${editedCoffeeShopSlug ? editedCoffeeShopSlug : coffeeShop.slug}`
            );
            const coffeeShopPhoto = await client.coffeeShopPhoto.create({
              data: {
                url: photoUrl,
                shop: {
                  connect: {
                    id: editedCoffeeShop.id,
                  },
                },
              },
            });
            coffeeShopPhotos.push(coffeeShopPhoto);
          }
        }
        return {
          ok: true,
          shop: editedCoffeeShop,
          photos: coffeeShopPhotos,
        };
      }
    ),
  },
};

export default resolvers;
