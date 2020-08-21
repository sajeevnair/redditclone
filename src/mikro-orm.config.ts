import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";


export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post],
    dbName: 'reddit_clone',
    type: 'postgresql',
    debug: !__prod__,
    port: 5433,
    user: 'sajeevnair',
    password: '1234',
} as Parameters<typeof MikroORM.init>[0];