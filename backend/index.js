import express from 'express';
import http from 'http';
import cors from 'cors';

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './typeDefs/index.js';

import { connectDB } from './db/connectDB.js';
import { configurePassport } from './passport/passport.config.js';

import passport from 'passport';
import session from 'express-session';
import ConnectMongoDBSession, { MongoDBStore } from 'connect-mongodb-session';

import dotenv from 'dotenv';
import { buildContext } from 'graphql-passport';
dotenv.config({
    // path:'.env',
    // debug: true,
});
configurePassport();

const app = express();
const httpServer = http.createServer(app);

const mongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

store.on("error",(err) => {console.log(err);});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // whether to save session to the store on request
    saveUninitialized: false, // whether to save uninitialized sessions
    cookie:{
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, //prevents cross-site scripting attacks
    },
    store: store
  })
)

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs:mergedTypeDefs,
    resolvers:mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/',
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req,res }) => buildContext({req,res}),
    }),
);
  
  // Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/`);