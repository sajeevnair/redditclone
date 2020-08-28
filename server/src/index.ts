import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import connectRedis from 'connect-redis';
import redis from "redis";
import { MyContext } from "./types";
import cors from "cors";




const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true
        }));
    app.use(
        session(
            {
                name: 'qid',
                store: new RedisStore(
                    {
                        client: redisClient,
                        disableTouch: true,

                    }),
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: __prod__
                },
                saveUninitialized: false,
                secret: "manbearpig",
                resave: false,
            }
        )
    );

    const appolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });


    appolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => {
        console.log('Server started on http://localhost:4000');

    });
};

main().catch(err => {
    console.error(err);
});