import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    toggleFollow(username: String!): MutationResponse!
  }
`;
