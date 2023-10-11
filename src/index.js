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

    let notes = [
        { id: '1', content: 'This is a note', author: 'Adam Scott' },
        { id: '2', content: 'This is another note', author: 'Harlow Everly' },
        { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
        ];

    const typeDefs = `#graphql

    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Mutation {
        newNote(content: String!): Note!
    } 
    `;

   // Define your resolvers
    const resolvers = {
        Query: {
            notes: () => notes,
            note: (parent, args) => {
                return notes.find(note => note.id === args.id)
            }
        },

        Mutation: {
            newNote: (parent, args) => {
                let noteValue = {
                    id: String(notes.length + 1),
                    content: args.content,
                    author: "Adam Scott"
                }

                notes.push(noteValue)
                return noteValue
            }
        }
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
