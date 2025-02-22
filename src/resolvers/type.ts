import { IResolvers } from "@graphql-tools/utils";
import { database } from '../data/data.store';
import _ from 'lodash'; // https://lodash.com/docs/4.17.15

// In this file we define resolvers for relations between types.
const type: IResolvers = {
    RapidFire: {
        ship: parent => {
            return _.find(
                database.ships,
                function(s) { return s.id == parent.ship; }
            );
        },
        probability: parent => {
            return 100 - 100/parent.shots;
        }
    },

    Cost: {
        resource: parent => {
            return _.find(
                database.resources,
                function(resource) { return resource.type == parent.resource; }
            );
        }
    },

    Fleet: {
        totalShips: parent => {
            return _.reduce(
                parent.shipNumbers,
                function (totalShips, shipNumber) { return totalShips + shipNumber.number; },
                0
            );
        },
    },

    ShipNumber: {
        ship: parent => {
            return _.find(
                database.ships,
                function(s) { return s.id == parent.ship; }
            );
        },
        weapon_power: parent => {
            const ship = _.find(
                database.ships,
                function(s) { return s.id == parent.ship; }
            );
            
            if (ship == undefined) {
                return -1;
            }

            return parent.number * ship.weapon_power;
        },
        cargo_capacity: parent => {
            const ship = _.find(
                database.ships,
                function(s) { return s.id == parent.ship; }
            );
            
            if (ship == undefined) {
                return -1;
            }

            return parent.number * ship.cargo_capacity;
        },
        
    },
}

export default type;