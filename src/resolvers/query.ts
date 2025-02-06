import { IResolvers } from "@graphql-tools/utils";
import { database } from '../data/data.store';
import _ from 'lodash';

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

        fleets(): Array<any> {
            return database.fleets;
        },

        runSimulation(parent: void, {attackerFleetId, defenderFleetId}): any {

            // Battle rules: https://ogame.fandom.com/wiki/Combat
            
            // Retrieve fleets
            let initialAttackerFleet = database.fleets.filter(f => f.id === attackerFleetId)[0];
            if (initialAttackerFleet == undefined) {
                return { summary: `Fleet with id ${attackerFleetId} not found. Simulation aborted.` };
            }
            let initialDefenderFleet = database.fleets.filter(f => f.id === defenderFleetId)[0];
            if (initialDefenderFleet == undefined) {
                return { summary: `Fleet with id ${defenderFleetId} not found. Simulation aborted.` };
            }

            // Arrays where each item represents a ship.
            let attackingShips: Array<any> = fleet2Ships(initialAttackerFleet);            
            let defendingShips: Array<any> = fleet2Ships(initialDefenderFleet);

            // Simulate battle.
            let round = 0;
            while (++round <= 6                 // Up to 6 rounds
                && attackingShips.length > 0    // Attacker has ships
                && defendingShips.length > 0    // Defender has ships
            ) {
                console.log(`===============\n=== ROUND ${round} ===\n===============`);
                const numAttackingShips = attackingShips.length;

                // Attacker fires first, defender fires after
                console.log("  <<< Attacker shooting >>>");
                shoot(attackingShips, defendingShips);
                console.log("  <<< Defender shooting >>>");
                shoot(defendingShips, attackingShips); 
                
                // Ships are destroyed at the end of the round
                cleanupExploded(attackingShips);
                cleanupExploded(defendingShips);

                // Parameters W and S of remaining ships are restored
                restoreParameters(attackingShips);
                restoreParameters(defendingShips);
            }

            let battleResult = 'DRAW';
            if (attackingShips.length === 0) {
                battleResult = 'DEFENDER_WINS';
            }
            else if (defendingShips.length === 0) {
                battleResult = 'ATTACKER_WINS';
            }


            return {
                attackerFleet: initialAttackerFleet,
                defenderFleet: initialDefenderFleet,
                rounds: round-1,
                battleResult: battleResult,
                summary: `After ${round-1} rounds, the battle ends with result ${battleResult}`,
                remainingAttackerFleet: ships2Fleet(initialAttackerFleet.id, initialAttackerFleet.name, attackingShips),
                remainingDefenderFleet: ships2Fleet(initialDefenderFleet.id, initialDefenderFleet.name, defendingShips),
            };
        }
    }
}

function fleet2Ships(fleet: {shipNumbers: {ship: string, number: number}[]}): Array<any> {
    let ships: Array<any> = [];

    fleet.shipNumbers.forEach((shipNumber) => {
        const ship = _.find(
            database.ships,
            function(s) { return s.id == parseInt(shipNumber.ship, 10); }
        );
        if (ship == undefined) {
            return;
        }
        for (let num = 0; num < shipNumber.number; ++num) {
            ships.push({
                'ref': ship,    // Shared reference to the original Ship's data
                'W': ship.weapon_power,             // Weaponry
                'S': ship.shield_power,             // Shielding
                'H': ship.structural_integrity,     // Hull Plating
                'H_i': ship.structural_integrity,   // Initial Hull Plating
            });
        }
    });

    return ships;
}

function shoot(shootingShips: Array<any>, targetShips: Array<any>): void {

    const numTargetShips = targetShips.length;

    shootingShips.forEach((shootingShip, index) => {
        console.log(`       !!! [${index}] ${shootingShip['ref'].name} attacking (W: ${shootingShip['W']}):`);

        let canFire: boolean = true;
        while (canFire) {
            // 1. Select a random target
            const targetIndex = randomTarget(numTargetShips);
            let targetShip = targetShips[targetIndex];
            console.log(`              => [${targetIndex}] ${targetShip['ref'].name} shot.`);
            console.log(`                       * [Before] S: ${targetShip['S']}; H: ${targetShip['H']}; H_i: ${targetShip['H_i']}`);

            // 2. Attack target
            if (targetShip['H'] === 0) {
                console.log('                       * Target already exploded during the round');
            }
            else if (shootingShip['W'] < 0.01 * targetShip['S']) {
                console.log('                       * Bounced shot');
            }
            else if (shootingShip['W'] <= targetShip['S']) {
                targetShip['S'] -= shootingShip['W'];
            }
            else {
                targetShip['H'] = _.max([
                    0, 
                    targetShip['H'] - (shootingShip['W'] - targetShip['S'])
                ]);
                targetShip['S'] = 0;
            }
            console.log(`                       * [After]  S: ${targetShip['S']}; H: ${targetShip['H']}; H_i: ${targetShip['H_i']}`);

            // 3. Check odds for the target to explode
            if (targetShip['H'] < 0.7 * targetShip['H_i']) {
                const chanceToExplode = 1 - targetShip['H'] / targetShip['H_i'];
                if (chanceToExplode > Math.random()) {
                    targetShip['H'] = 0;
                    console.log('                       * Target exploded!');
                }
            }

            // 4. If the attacker has rapid fire against the target, roll a die for shooting again
            const rapidFire = shootingShip['ref'].rapid_fire_against.filter(
                (rfa: any) => parseInt(rfa.ship, 10) === targetShip['ref'].id
            )[0];

            if (rapidFire == undefined) {
                canFire = false;
                console.log('                       * Rapid fire not available');
                continue;
            }
            const chanceForRapidFire = 1 - 1/rapidFire.shots;
            canFire = chanceForRapidFire > Math.random();
            console.log(`                       * Rapid fire available (${chanceForRapidFire}). Succesful? ${canFire}`);
        }
    });
}

function randomTarget(max: number): number {
    return Math.floor(Math.random() * max);
}

function cleanupExploded(ships: Array<any>): void {
    // Traverse backwards to remove in-place without side-effects.
    for (let i = ships.length - 1; i >= 0; i--) {
        if (ships[i]['H'] === 0) {
            ships.splice(i, 1);
        }
    }
}

function restoreParameters(ships: Array<any>): void {
    ships.forEach((ship: any, index: number) => {
        ship['W'] = ship['ref'].weapon_power;
        ship['S'] = ship['ref'].shield_power;
    });
}

function ships2Fleet(fleetId: string, fleetName: string, ships: Array<any>): any {
    const shipNumbers: Array<any> = ships.reduce(
        function (shipNumbers: Array<any>, ship) {
            let shipNumber = _.find(shipNumbers, sn => sn.ship.id == ship['ref'].id);

            if (shipNumber != undefined) {
                shipNumber.number++;
            } else {
                shipNumbers.push({
                    'ship': ship['ref'].id,
                    'number': 1,
                });
            }

            return shipNumbers;
        },
        []
    ); 

    return {
        id: fleetId,
        name: fleetName,
        shipNumbers: shipNumbers,
        totalShips: ships.length,
    };
}

export default query;