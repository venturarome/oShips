import { createSchema } from "graphql-yoga";
import 'graphql-import-node'  // Allows detection of .graphql files
import typeDefs from './schema.graphql'
import resolvers from "../resolvers/resolversMap";

// Create executable schema
const schema = createSchema({
  typeDefs: [typeDefs],   // Entities and relations between them
  resolvers: [resolvers]  // How to print entities and their relations for each query/mutation/subscription
});

export default schema;