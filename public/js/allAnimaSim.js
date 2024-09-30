import MockUp from './Classes/MockUp.js'

//form
const simTypeForm = document.querySelector('#sim-type-form');

//sim vars
const gridArray = [];
let round = 0;
let mockUpList = [];
let mockUpListLength = 0;
let numberOfSims = 100;
let tieCount = 0;

// //tests
// let jTest = 0;
// let combTest = 0;
// let test = 0

//submit event listener
simTypeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    //script to access form data
    const formData = new FormData(simTypeForm);
    const simType = formData.get('anima-source');
    const combatType = formData.get('combat-type');

    //init sim
    handleSelections(simType, combatType);
});

async function handleSelections(simType, combatType) {
    if (simType === 'mockUp') {
        //get all mock ups
        mockUpList = await fetch('/asset/mockup').then((res) => { return res.json() });
        mockUpListLength = mockUpList.length;
        //Create grid array
        for (let i = 0; i < mockUpListLength + 1; i++) {
            let row = []
            for (let j = 0; j < mockUpListLength; j++) {
                if (i === 0) {
                    if (j === 0) {
                        row.push('-');
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
        if (combatType === 'oneVOne') {
            mockUpListLength = 23;
            for (let i = 0; i < mockUpListLength - 1; i++) {
                //console.log("i = " + i);
                for (let j = i + 1; j < mockUpListLength; j++) {
                    //jTest++
                    //console.log(jTest)
                    //console.log('j = ' + j)
                    runSim([mockUpList[i]], [mockUpList[j]], numberOfSims)
                    //check if it is the final itteration
                    if (j === mockUpListLength - 1 && i === mockUpListLength - 2) {
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
    // combTest++;
    // console.log(combTest)
    console.log('runSim combatant ID: ' + combatants[0].id);
    console.log('runSim enemy ID: ' + enemies[0].id);
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

    //set a target if there are multiple defenders
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
                //increase attackers total damage if damage is greater than defense (used as weighted var in winLossComp)
                attacker.upTotalDamage(damageFraction);
            }
            // console.log('defenderHp: ' + defender.hp)
        });
        //increase defenders excess defense if damage is less than defense (used as weighted var in winLossComp)
    } else if (defense > totalDamage) {
        // console.log('no damage to report');
        defender.upTotalExcessDefense(defense - totalDamage);
    } else {
        // console.log('0 damage')
    }

    //check for unproductive pairing
    if (attackers[0].turnCount === 40) {
        tie = true;
        // increase tieCount wich will end unproducitve pairings after 25% of the matches have resulted in ties
        tieCount++;
    }

    //if defender is still alive call combat again
    if (defender.isAlive() && !tie) {
        //switch between combat initiation and counterstrikes
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
        //console.log(tie);
        turn++;

        //End the sim if 25% of the combats have resulted in a tie
        if (tieCount >= numberOfSims / 4) {
            tieCount = 0;
            round = numberOfSims;
            combatants.forEach(attacker => {
                enemies.forEach(defender => {
                    const obj1 = attacker.report();
                    const obj2 = defender.report();
                    console.log(attacker.report())
                    console.log(defender.report())
                    compWinLoss(obj1, obj2, round);
                });
            });
            console.log('unproducive pairing detected')
            //send reports for comilation
            
        }

        //reset each anima
        combatants.forEach(attacker => {
            attacker.reset();
        });
        enemies.forEach(defender => {
            defender.reset();
        });

    } else if (!defender.isAlive() && !tie && round < numberOfSims - 1) {
        //End the round
        round++
        //remove defeaded defender from defender array
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

        //reset each anima
        combatants.forEach(attacker => {
            attacker.reset();
        });
        enemies.forEach(defender => {
            defender.reset();
        });
    } else if (!defender.isAlive() && !tie && round === numberOfSims - 1) {
        round++;
        //send reports for comilation
        combatants.forEach(attacker => {
            enemies.forEach(defender => {
                const obj1 = attacker.report();
                const obj2 = defender.report();
                compWinLoss(obj1, obj2, round);
            });
        });
    }
}

//COMPILE DATA-----------------------------------
const compWinLoss = (obj1, obj2, i) => {
    // test++
    // console.log(test)
    if (i === numberOfSims) {
        //weights
        const wLWeight = 8;
        //track and report remaining hp
        const wHp = 2;
        const wDam = .75;
        const wDef = .25;
        const weightSum = wLWeight + wHp + wDam + wDef;

        //ratios
        const obj1WinLossRatio = (obj1.totalWins / numberOfSims) * wLWeight;
        const obj1WeightedHp = obj1.hpTracking / ((obj1.orgHp * numberOfSims) * wHp);
        const obj1WeightedDam = obj1.totalDamage / (obj1.turnCountComp / 2) * wDam;
        const obj1WeightedDef = (obj1.totalExcessDefense / 10 / (obj1.turnCountComp / 2)) * wDef;

        const obj2WinLossRatio = (obj2.totalWins / numberOfSims) * wLWeight;
        const obj2WeightedHp = obj2.hpTracking / ((obj2.orgHp * numberOfSims) * wHp);
        const obj2WeightedDam = obj2.totalDamage / (obj2.turnCountComp / 2) * wDam;
        const obj2WeightedDef = (obj2.totalExcessDefense / 10 / (obj2.turnCountComp / 2)) * wDef;

        //weighted averages
        const obj1WeightedAverage = (obj1WinLossRatio + obj1WeightedHp + obj1WeightedDam + obj1WeightedDef) / weightSum;
        const obj2WeightedAverage = (obj2WinLossRatio + obj2WeightedHp + obj2WeightedDam + obj2WeightedDef) / weightSum;
        console.log('obj1 ID: ' + obj1.id)
        //console.log(obj1.totalWins)
        //console.log(obj1WinLossRatio);
        console.log('obj2 ID: ' + obj2.id)
        //console.log(obj2.totalWins)
        //console.log(obj2WinLossRatio)
        // console.log(obj1.turnCountComp)
        // console.log(obj2.turnCountComp)

        gridArray[obj1.id][obj2.id] = ((obj1WeightedAverage + Number.EPSILON) * 100) / 100;
        gridArray[obj2.id][obj1.id] = ((obj2WeightedAverage + Number.EPSILON) * 100) / 100;
        //console.log(gridArray);
    }
}

function createCSV() {
    console.log(gridArray);
    // let csvContent = "data:text/csv;charset=utf-8," + gridArray.map(e => e.join(",")).join("\n");
    //         var encodedUri = encodeURI(csvContent);
    //         var link = document.createElement("a");
    //         link.setAttribute("href", encodedUri);
    //         link.setAttribute("download", "weighted_mockup_comp.csv");
    //         document.body.appendChild(link); // Required for FF

    //         link.click();
}
