/*
  Warnings:

  - You are about to drop the `Hashtag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoffeeShopToHashtag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentToHashtag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CoffeeShopToHashtag" DROP CONSTRAINT "_CoffeeShopToHashtag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoffeeShopToHashtag" DROP CONSTRAINT "_CoffeeShopToHashtag_B_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToHashtag" DROP CONSTRAINT "_CommentToHashtag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToHashtag" DROP CONSTRAINT "_CommentToHashtag_B_fkey";

-- DropTable
DROP TABLE "Hashtag";

-- DropTable
DROP TABLE "_CoffeeShopToHashtag";

-- DropTable
DROP TABLE "_CommentToHashtag";
