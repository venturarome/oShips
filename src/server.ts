import { createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import schema from './schema'

// NOTE: in video 49, they change to apollo-server-express. I will not do it for the moment (I'm happy with Yoga).

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
    schema: schema,
    graphqlEndpoint: '/graphql',
});
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

const PORT = 5300;
server.listen(
    PORT,
    () => { console.info(`Server oShips is running on http://localhost:${PORT}`); }
);
