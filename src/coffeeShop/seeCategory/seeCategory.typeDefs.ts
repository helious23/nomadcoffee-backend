import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeCategory(categoryName: String!, page: Int!): [CoffeeShop]
  }
`;
