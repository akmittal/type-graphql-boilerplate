import 'reflect-metadata';
import 'es6-shim';
import { ApolloServer } from 'apollo-server';
import { createConnection, useContainer } from 'typeorm';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';
import { UserResolver } from './resolver/UserResolver';
import { customAuthChecker, getUser } from './util';

async function main() {
    dotenv.config();

    const connection = await createConnection();

    const schema = await buildSchema({
        resolvers: [UserResolver],
        authChecker: customAuthChecker,
    });
    const server = new ApolloServer({
        schema,
        context: async ({ req }) => {
            const token = req.headers.authorization || '';

            // try to retrieve a user with the token
            try{
                const user = getUser(token);

            // add the user to the context
            return { user };
            } catch(error){
                return {error}
            }
            
        },
    });
    await server.listen(4000);
}

main()
    .then((e) => {
        console.log('Server has started!');
    })
    .catch((e) => {
        throw e;
    });
