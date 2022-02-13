import { gql } from "apollo-server-express";

export default gql`
  type createCoffeeShopResult {
    ok: Boolean!
    error: String
    shop: CoffeeShop
    photos: [CoffeeShopPhoto]
  }
  type Mutation {
    createCoffeeShop(
      name: String!
      latitude: String!
      longitude: String!
      description: String
      address: String
      categories: [String]!
      photos: [Upload]
    ): createCoffeeShopResult!
  }
`;
