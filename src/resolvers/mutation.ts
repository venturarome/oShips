import { IResolvers } from "@graphql-tools/utils";
import { database } from '../data/data.store';
import _ from 'lodash'

const mutation: IResolvers = {
    Mutation: {
        addFleet(parent: void, { fleetInput }): any {
            // Validation: avoid duplicated names
            if (database.fleets.filter(f => f.name === fleetInput.name).length === 1) {
                return {
                    id: `A fleet named ${fleetInput.name} already exists.`,
                    name: `A fleet named ${fleetInput.name} already exists.`,
                    shipNumbers: [],
                };
            }

            const objFleet = {
                id: String(database.fleets.length + 1),
                name: fleetInput.name,
                shipNumbers: fleetInput.shipNumbers,
            };

            database.fleets.push(objFleet);

            return objFleet;
        },
        deleteFleet(parent: void, { id }): any {
            const deletedFleet = _.remove(database.fleets, f => f.id === id);

            if (deletedFleet[0] == undefined) {
                return {
                    id: `Cannot delete fleet with id ${id} because it does not exist.`,
                    name: `Cannot delete fleet with id ${id} because it does not exist.`,
                    shipNumbers: [],
                };
            }

            return deletedFleet[0];
        },
    }
}

export default mutation;