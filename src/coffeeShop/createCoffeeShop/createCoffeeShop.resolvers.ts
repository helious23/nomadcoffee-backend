import { uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processCategories, getOrCreate } from "../coffeeShop.utils";

const resolvers: Resolvers = {
  Mutation: {
    createCoffeeShop: protectedResolver(
      async (
        _,
        { name, latitude, longitude, categories, photos },
        { client, loggedInUser }
      ) => {
        const newCoffeeShopName = name.trim().toLowerCase();
        const newCoffeeShopSlug = newCoffeeShopName.replace(/ +/g, "-");
        const exist = await client.coffeeShop.findUnique({
          where: {
            slug: newCoffeeShopSlug,
          },
          select: { id: true },
        });
        if (exist) {
          return {
            ok: false,
            error: "이미 등록된 카페입니다.",
          };
        }

        let categoryObj = [];
        if (categories) {
          categoryObj = await Promise.all(await getOrCreate(categories));
        }

        const newCoffeeShop = await client.coffeeShop.create({
          data: {
            name,
            latitude,
            longitude,
            slug: newCoffeeShopSlug,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(categoryObj.length > 0 && {
              categories: { connectOrCreate: processCategories(categoryObj) },
            }),
          },
        });

        let coffeeShopPhotos = [];
        if (photos) {
          for (let i = 0; i < photos.length; i++) {
            const photoUrl = await uploadToS3(
              photos[i],
              loggedInUser.username,
              newCoffeeShopSlug
            );
            const coffeeShopPhoto = await client.coffeeShopPhoto.create({
              data: {
                url: photoUrl,
                shop: {
                  connect: {
                    id: newCoffeeShop.id,
                  },
                },
              },
            });
            coffeeShopPhotos.push(coffeeShopPhoto);
          }
        }
        return {
          ok: true,
          shop: newCoffeeShop,
          photos: coffeeShopPhotos,
        };
      }
    ),
  },
};

export default resolvers;
