import { gql } from "apollo-server";

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    name: String!
    location: String
    avatarURL: String
    githubUsername: String
    followings(lastId: Int): [User]
    followers(lastId: Int): [User]
    shops(offset: Int!): [CoffeeShop]
    likedShops: [CoffeeShop]
    totalShops: Int!
    createdAt: String!
    updatedAt: String!
    totalFollowers: Int!
    totalFollowing: Int!
    isFollowing: Boolean!
    isMe: Boolean!
  }
`;
