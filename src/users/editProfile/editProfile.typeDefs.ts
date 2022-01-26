import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editProfile(
      username: String
      name: String
      email: String
      password: String
      location: String
      avatarURL: Upload
      githubUsername: String
    ): MutationResponse!
  }
`;
