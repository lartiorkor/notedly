// app.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');

const app = express();

// Define your GraphQL schema using Apollo Server's gql template literal
// The GraphQL schema
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

// Create an Apollo Server instance and connect it to Express
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo Server middleware to Express
// server.applyMiddleware({ app });

// Define a route for Express to handle GraphQL requests (optional)
app.get('/graphql', (req, res) => {
    res.send('GraphQL is running!');
});

// Start the Express server
app.listen({ port: 4000 }, () =>
    console.log(`Server is running at http://localhost:4000/graphql`)
);