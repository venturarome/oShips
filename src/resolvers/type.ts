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
    }
}

export default type;