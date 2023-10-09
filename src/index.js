// npm install @apollo/server express graphql cors body-parser
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require ('http');
const cors = require('cors');
const pkg = require ('body-parser');
const { json } = pkg;
(async function() {
    const app = express();
    const httpServer = http.createServer(app);

    const typeDefs = `#graphql
    type Query {
        hello: String
    }
    `;

    // Define your resolvers
    const resolvers = {
        Query: {
            hello: () => 'world',
        },
    };

    const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }),
    );

    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
})()
