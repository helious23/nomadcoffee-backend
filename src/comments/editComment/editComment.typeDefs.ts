import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editComment(id: Int!, payload: String!, rating: Int!): MutationResponse!
  }
`;
