import { gql } from "apollo-server";

export default gql`
  type Mutation {
    createComment(
      shopId: Int!
      payload: String!
      rating: Int!
    ): MutationResponse!
  }
`;
