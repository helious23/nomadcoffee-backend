import { gql } from "apollo-server-express";

export default gql`
  type Query {
    searchShops(keyword: String!, lastId: Int): [CoffeeShop]
  }
`;
