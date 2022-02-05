import { gql } from "apollo-server";

export default gql`
  type Query {
    seeCoffeeShopComments(lastId: Int, id: Int!): [Comment]
  }
`;
