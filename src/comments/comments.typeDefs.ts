import { gql } from "apollo-server";

export default gql`
  type Comment {
    id: Int!
    user: User!
    shop: CoffeeShop!
    payload: String!
    rating: Int!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
