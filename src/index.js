const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const port = process.env.PORT || 4000;

// Create an Express app
const app = express();

// Apply middleware to parse JSON request bodies
app.use(express.json());

// Define your GraphQL schema and resolvers
const typeDefs = `
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello World!'
    }
};

// Create an executable schema
const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Use express-graphql middleware to handle GraphQL requests
app.use(
    '/graphql',
    graphqlHTTP({
        schema: executableSchema,
        graphiql: true,
    })
);

// Start the Express server
app.listen(port, () =>
    console.log(`GraphQL server running at http://localhost:${port}/graphql`)
);
