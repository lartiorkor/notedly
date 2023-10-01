const express = require("express");
// const {ApolloServer, gql} = require('apollo-server-express')
const { graphqlHTTP } = require ('express-graphql')
const { makeExecutableSchema } = require ('@graphql-tools/schema')


const port = process.env.PORT || 4000

// app.get("/", (req, res) => res.send("Hello Web Server!!!"))

//schema
const typeDefs = `
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

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })
  
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: executableSchema,
      graphiql: true,
    })
  )

// applying apollogql middleware and setting to path api
server.applyMiddleware({ app, path: '/api'});

app.listen({port}, () => 
    console.log(`GraphQl server running at http://localhost: ${port}${server.graphqlPath}`
    )
);
