// const express = require("express");
// const { graphqlHTTP } = require('express-graphql');
// const { makeExecutableSchema } = require('@graphql-tools/schema');

// const port = process.env.PORT || 4000;

// // Create an Express app
// const app = express();

// // Apply middleware to parse JSON request bodies
// app.use(express.json());

// // Define your GraphQL schema and resolvers
// const typeDefs = `
//     type Query {
//         hello: String
//     }
// `;

// const resolvers = {
//     Query: {
//         hello: () => 'Hello World!'
//     }
// };

// // Create an executable schema
// const executableSchema = makeExecutableSchema({
//     typeDefs,
//     resolvers,
// });

// // Use express-graphql middleware to handle GraphQL requests
// app.use(
//     '/graphql',
//     graphqlHTTP({
//         schema: executableSchema,
//         graphiql: true,
//     })
// );

// // Start the Express server
// app.listen(port, () =>
//     console.log(`GraphQL server running at http://localhost:${port}/graphql`)
// );



// npm install @apollo/server express graphql cors body-parser
const { ApolloServer }  = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { typeDefs, resolvers } = require('./schema');

interface MyContext {
  token?: string;
}

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);