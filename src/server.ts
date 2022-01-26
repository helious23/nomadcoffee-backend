require("dotenv").config();
import * as http from "http";
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./schema";
import client from "./client";
import { getUser } from "./users/users.utils";

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (ctx) => {
    const {
      req: { headers },
    } = ctx;
    return {
      loggedInUser: await getUser(headers.token),
      client,
    };
  },
});

const PORT = process.env.PORT;

const app = express();
app.use(logger("dev"));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);

httpServer.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT} ✅`)
);
