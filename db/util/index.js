const MockUp = require('../../public/js/Classes/MockUp');
const fs = require('fs');
const inquirer = require('inquirer');



//sim vars
const gridArray = [];
let round = 0;
let mockUpList = [];
let numberOfSims = 100;
let tieCount = 0

//mockup arrays
const hpArray = [2, 3, 4, 5];
const baseArray = [0, 1, 2, 3, 4, 5];
const modArray = [4, 6, 8, 10, 12, 20];
const spdArray = [1, 2, 3];

//hp
for (let i = 0; i < hpArray.length; i++) {
    //baseAtk
    for (let j = 0; j < baseArray.length; j++) {
        //atkMod
        for (let k = 0; k < modArray.length; k++) {
            //baseDef
            for (let l = 0; l < baseArray.length; l++) {
                //defMod
                for (let m = 0; m < modArray.length; m++) {
                    //spd
                    for (let n = 0; n < spdArray.length; n++) {
                        if(baseArray[j] !== 0 || baseArray[l] !== 0){
                            const mockUp = {
                                id: 1+n+n+l+k+j+i,
                                name: `${hpArray[i]}-${baseArray[j]}:${modArray[k]}-${baseArray[l]}:${modArray[m]}-${spdArray[n]}`,
                                card_type: 'mock_up',
                                hp: hpArray[i],
                                base_atk: baseArray[j],
                                atk_mod: modArray[k],
                                base_def: baseArray[l],
                                def_mod: modArray[m],
                                spd: spdArray[n],
                            };
                            mockUpList.push(mockUp);
                        }
                    }
                }
            }
        }

    }
}

//submit event listener
const init = async () => {
    const selectionPrompts = await inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select the database source',
                choices: ['Mockup', 'Cards'],
                name: 'source'
            },
            {
                type: 'list',
                message: 'Select the combat type',
                choices: ['1 v 1', '2 v 1', '3 v 1'],
                name: 'combat'
            }
        ])
        .then(async (res) => {
            console.log(res.source)
            console.log(res.combat)
            handleSelections(res.source, res.combat)
        });
}

async function handleSelections(simType, combatType) {
    if (simType === 'Mockup') {
        //Create grid array
        for (let i = 0; i < mockUpList.length + 1; i++) {
            let row = []
            for (let j = 0; j < mockUpList.length; j++) {
                if (i === 0) {
                    if (j === 0) {
                        row.push(0);
                        row.push(mockUpList[j].name);
                    } else {
                        row.push(mockUpList[j].name);
                    }
                } else {
                    row.push(0);
                }
            }
            if (i === 0) {
                gridArray.push(row);
            } else {
                row.unshift(mockUpList[i - 1].name);
                gridArray.push(row);
            }
        }
        //combat type conditions     
        if (combatType === '1 v 1') {
            for (let i = 0; i < mockUpLis.lengtht - 1; i++) {
                console.log("i = " + i);
                for (let j = i + 1; j < mockUpList.length; j++) {
                    // console.log('j = ' + j)
                    runSim([mockUpList[i]], [mockUpList[j]], numberOfSims)
                    //check if it is the final itteration
                    if(j === mockUpList.length - 1 && i === mockUpList.length - 2) {
                        console.log('Prepping CSV Please wait... Like awhile... Maybe days lol')
                        createCSV();
                    }
                }
            }
        } else if (combatType === 'twoVOne') {

        } else if (combatType === 'threeVOne') {

        }
    } else if (simType === 'card') {
        if (combatType === 'oneVOne') {

        } else if (combatType === 'twoVOne') {

        } else if (combatType === 'threeVOne') {

        }
    }
}

//INIT SIM---------------------------------------
const runSim = function (combatants, enemies, simCount) {
    //use the json data from handleSelections to create Classes
    for (let i = 0; i < combatants.length; i++) {
        const combatant = combatants[i];
        const anima = new MockUp(mockUpList[combatant.id - 1]);
        // console.log(anima.name);
        // console.log(combatant.name);
        combatants[i] = anima
    }
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const anima = new MockUp(mockUpList[enemy.id - 1]);
        // console.log(anima.name);
        // console.log(enemy.name);
        enemies[i] = anima
    }

    //track the number of rounds

    round = 0;
    while (round < simCount) {
        //para{3} always needs to be 0
        combat(combatants, enemies, 0);
    }
}

//COMBAT-------------------------------------------
const combat = function (combatants, enemies, turn) {
    //increase turn count

    //global combat vars
    let tie = false;
    let totalDamage = 0;
    let defense = 0;
    const attackers = combatants.slice();
    const defenders = enemies.slice();
    let defender = defenders[0];

    // console.log(attackers[0].name);
    //get total damage for the turn
    attackers.forEach(attaker => {
        const thisCombatantDamage = attaker.getAtkDamage();
        attaker.turnCount++
        totalDamage += thisCombatantDamage;
        // console.log('totalDamage: ' + totalDamage)
    });

    //increase defenders turn count
    defenders.forEach(defender => {
        defender.turnCount = defender.turnCount
    })

    //set a target is there are multiple defenders
    if (attackers.length > 0 && !attackers[0].target) {
        attackers[0].pickTarget(defenders);
        defenders[attackers[0].target].setTarget();
    }

    //get def for the turn
    if (attackers[0].hasTarget) {
        defender = defenders[attackers[0].target]
        defense = defender.getDefense();
        // console.log("defense: " + defense);
    } else {
        defense = defender.getDefense();
        // console.log("defense: " + defense);
    }

    //apply and track damage
    if (totalDamage > defense) {
        // console.log('pre damage defenderHp: ' + defender.hp)
        defender.takeDamage(totalDamage - defense);
        attackers.forEach(attacker => {
            let damageFraction = Math.round(attacker.storedAtk - defense / attackers.length);
            if (damageFraction > 0) {
                attacker.upTotalDamage(damageFraction);
            }
            // console.log('defenderHp: ' + defender.hp)
        });
    } else if (defense > totalDamage) {
        // console.log('no damage to report');
        defender.upTotalExcessDefense(defense - totalDamage);
    } else {
        // console.log('0 damage')
    }

    //check for unproductive pairing
    if (attackers[0].turnCount === 40) {
        tie = true;
        tieCount++;
    }

    if (defender.isAlive() && !tie) {
        if (turn % 2 === 0) {
            turn++;
            // console.log('combatnat Name' + attackers[0].name);
            combat(combatants, enemies, turn);
        } else {
            turn++;
            // console.log('combatnat Name' + attackers[0].name);
            if (turn > 3) {
                turn = 0;
            }
            combat(enemies, combatants, turn);
        }
    } else if (tie) {
        turn++;

        //send reports for comilation
        combatants.forEach(attacker => {
            enemies.forEach(defender => {
                const obj1 = attacker.report();
                const obj2 = defender.report();
                compWinLoss(obj1, obj2);
            });
        });

        //reset each anima
        combatants.forEach(attacker => {
            attacker.reset();
        });
        enemies.forEach(defender => {
            defender.reset();
        });

        //End the sim if 25% of the combats have resulted in a tie
        if(tieCount >= numberOfSims/4){
            tieCount = 0;
            round = numberOfSims;
        }
    } else if (!defender.isAlive() && !tie) {
        //End the round
        round++
        const defenderIndex = defenders.findIndex(function (anima) {
            return anima.name === defender.name;
        });
        defenders.splice(defenderIndex, 1);

        //set win/loss
        combatants.forEach(attacker => {
            attacker.setWinLoss(true);
            attacker.hpTracking = attacker.hpTracking + attacker.hp;
            attacker.turnCountComp = attacker.turnCountComp + attacker.turnCount;
        });
        enemies.forEach(defender => {
            defender.setWinLoss(false);
            defender.hpTracking = defender.hpTracking + defender.hp;
            defender.turnCountComp = defender.turnCountComp + defender.turnCount;
        });

        //send reports for comilation
        combatants.forEach(attacker => {
            enemies.forEach(defender => {
                const obj1 = attacker.report();
                const obj2 = defender.report();
                compWinLoss(obj1, obj2, round);
            });
        });

        //reset each anima
        combatants.forEach(attacker => {
            attacker.reset();
        });
        enemies.forEach(defender => {
            defender.reset();
        });
    }
}

//COMPILE DATA-----------------------------------
const compWinLoss = (obj1, obj2, i) => {

    if (i === numberOfSims) {
        //weights
        const wLWeight = 8;
        //track and report remaining hp
        const wHp = 2;
        const wDam = .75;
        const wDef = .25;
        const weightSum = wLWeight + wHp + wDam + wDef;

        //ratios
        const obj1WinLossRatio = (obj1.totalWins / numberOfSims)* wLWeight;
        const obj1WeightedHp = obj1.hpTracking / ((obj1.orgHp * numberOfSims) * wHp);
        const obj1WeightedDam = obj1.totalDamage / (obj1.turnCountComp/2)* wDam;
        const obj1WeightedDef = (obj1.totalExcessDefense / 10 /(obj1.turnCountComp/2)) * wDef;

        const obj2WinLossRatio = (obj2.totalWins / numberOfSims)* wLWeight;
        const obj2WeightedHp = obj2.hpTracking / ((obj2.orgHp * numberOfSims) * wHp);
        const obj2WeightedDam = obj2.totalDamage / (obj2.turnCountComp/2)* wDam;
        const obj2WeightedDef = (obj2.totalExcessDefense / 10 /(obj2.turnCountComp/2)) * wDef;
        
        //weighted averages
        const obj1WeightedAverage = (obj1WinLossRatio + obj1WeightedHp + obj1WeightedDam + obj1WeightedDef) / weightSum;
        const obj2WeightedAverage = (obj2WinLossRatio + obj2WeightedHp + obj2WeightedDam + obj2WeightedDef) / weightSum;

        gridArray[obj1.id][obj2.id] = Math.round((obj1WeightedAverage + Number.EPSILON) * 100) / 100;
        gridArray[obj2.id][obj1.id] = Math.round((obj2WeightedAverage + Number.EPSILON) * 100) / 100;
    }
}

function createCSV () {
    let csvContent = "data:text/csv;charset=utf-8," + gridArray.map(e => e.join(",")).join("\n");
    fs.writeFileSync('./db/CSVs/weighted_win_loss_mockup.csv', csvContent, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log(data);
            return res.json(data);
        }
    });
}

init();