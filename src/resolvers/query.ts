import { IResolvers } from "@graphql-tools/utils";
import { database } from '../data/data.store';
import _ from 'lodash'

const query: IResolvers = {
    Query: {
        hello(): string {
            return 'Hello World!';
        },
        helloName(__: void, { name }): string {
            return `Hello ${name}`;
        },

        ships(): Array<any> {
            return database.ships;
        },
        ship(parent: void, { id }): any {
            const ship = database.ships.filter(s => s.id == id)[0];

            if (ship) return ship;

            // Seems that GraphQL does not handle errors easily ... Maybe there are better ways.
            return {
                id: `No ship found with id ${id}`,
                name: `No ship found with id ${id}`,
                description: `No ship found with id ${id}`,
            }
        },

        resources(): Array<any> {
            return database.resources;
        },
    }
}

export default query;