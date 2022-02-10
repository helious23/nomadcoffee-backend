import { gql } from "apollo-server-express";

export default gql`
  type EditCoffeeShopResult {
    ok: Boolean!
    error: String
    shop: CoffeeShop
    photos: [CoffeeShopPhoto]
  }
  type Mutation {
    editCoffeeShop(
      id: Int!
      name: String
      latitude: String
      longitude: String
      categories: [String]
      photos: [Upload]
      description: String
    ): EditCoffeeShopResult!
  }
`;
