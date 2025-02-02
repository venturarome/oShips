import { IResolvers } from "@graphql-tools/utils";
import query from "./query";

const resolvers : IResolvers = {
    ...query,
}

export default resolvers;