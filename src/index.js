const express = require("express");
const {ApolloServer, gql} = require('apollo-server-express')

const port = process.env.PORT || 4000

// app.get("/", (req, res) => res.send("Hello Web Server!!!"))

//schema
const typeDefs = gql`
    type Query{
        hello: String
    }
`;

//resolver
const resolvers = {
    Query: {
        hello: () => 'Hello World!'
    }
};

const app = express();

// server setup
const server = new ApolloServer({typeDefs, resolvers});

// applying apollogql middleware and setting to path api
server.applyMiddleware({ app, path: '/api'});

app.listen({port}, () => 
    console.log(`GraphQl server running at http://localhost: ${port}${server.graphqlPath}`
    )
);
