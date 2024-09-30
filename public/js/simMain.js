import Unit from './Classes/Unit.js'

//bootstrap dropdowns
const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl))

//dropdown lists vars
const animaSpdList = document.querySelector('#animaSpdList');
const spdSelection = document.querySelector('#spdSelection');
const spdListArray = [1, 2, 3, 4, 5, "All"]
const animaOneList = document.querySelector('#animaOneList');
const animaOneSelection = document.querySelector('#animaOneSelection');
const animaTwoList = document.querySelector('#animaTwoList');
const animaTwoSelection = document.querySelector('#animaTwoSelection');
const animaThreeList = document.querySelector('#animaThreeList');
const animaThreeSelection = document.querySelector('#animaThreeSelection');
const enemyList = document.querySelector('#enemyList');
const enemySelection = document.querySelector('#enemySelection');


//create arrays for storing all assets
let allUnits = [];
let allAvatars = [];
let allLetchin = [];
let allAssets = [];
let combatants = [];
let enemies = [];

//init sim vars
let round = 0;
const gridArray = [];

//EVENT LISTENERS--------------------------------
if (document.body.addEventListener) {
    document.body.addEventListener('click', evlController, false);
    //document.body.addEventListener('click', animaSelected, false);
}
else {
    document.body.attachEvent('onclick', evlController);//for IE
    //document.body.attachEvent('onclick', animaSelected);//for IE
}

//event listener controller
async function evlController(e) {
    e = e || window.Event;
    var target = e.target || e.srcElement;
    if (target.classList.contains("spd-item")) {
        spdSelection.innerText = target.innerText
        document.querySelectorAll('.missing-spd').forEach(e => e.remove());
        setUpDropdowns(allAssets);
    }

    if (target.classList.contains("anima-item")) {
        //set up selection display
        if (target.classList.contains("anima-0")) {
            animaOneSelection.innerText = target.innerText;
        } else if (target.classList.contains("anima-1")) {
            animaTwoSelection.innerText = target.innerText;
        } else if (target.classList.contains("anima-2")) {
            animaThreeSelection.innerText = target.innerText;
        } else if (target.classList.contains("anima-3")) {
            enemySelection.innerText = target.innerText;
        }
    }
    //init sim-----------------------------------
    if (target.id === "sim-submit") {
        const selectionArray = [animaOneSelection, animaTwoSelection, animaThreeSelection, enemySelection];

        for (let i = 0; i < selectionArray.length; i++) {
            const innerText = selectionArray[i].innerText;
            const currentIndex = allAssets.findIndex(function (anima) {
                return anima.name === innerText;
            });

            if (currentIndex >= 0) {
                if (allAssets[currentIndex].card_type === 'Unit') {
                    const currentAnima = await getUnit(allAssets[currentIndex].id);
                    const anima = new Unit(currentAnima);

                    //separate enemies from combatants
                    if (i === selectionArray.length - 1) {
                        enemies.push(anima);
                    } else {
                        combatants.push(anima);
                    }
                }
            }
        }
        runSim(combatants, enemies, 5);
    }
}

//SET UP DROPDOWNS-------------------------------
for (let i = 0; i < spdListArray.length; i++) {
    const spd = spdListArray[i];
    const li = document.createElement("li");

    li.setAttribute("class", "dropdown-item spd-item");
    li.innerText = spd;
    animaSpdList.appendChild(li);
}
//getters----------------------------------------
const getUnitList = async function () {
    const unitList = await fetch('/asset/unit').then((res) => { return res.json() });
    allUnits = unitList;
    await getAvatarList();
}

const getUnit = async function (id) {
    const unit = await fetch(`/asset/unit/${id}`).then((res) => { return res.json() });
    return (unit);
}

const getAvatarList = async function () {
    const avatarList = await fetch('/asset/avatar').then((res) => { return res.json() });
    allAvatars = avatarList;
    await getLetchinList();
}

const getLetchinList = async function () {
    const letchinList = await fetch('/asset/letchin').then((res) => { return res.json() });
    allLetchin = letchinList;
    allAssets = allUnits.concat(allAvatars, allLetchin);
    //sort array based on name
    allAssets = allAssets.toSorted((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    setUpDropdowns(allAssets)
}

//actual dropdown setup--------------------------
const setUpDropdowns = async function (assetsArr) {
    if (spdSelection.innerText === "selection 1") {
        const listArray = [animaOneList, animaTwoList, animaThreeList, enemyList];
        for (let i = 0; i < listArray.length; i++) {
            const element = listArray[i];
            const li = document.createElement("li");

            li.setAttribute("class", "dropdown-item missing-spd");
            li.innerText = "Please select a speed";
            element.appendChild(li);
        }
    } else {
        for (let i = 0; i < assetsArr.length; i++) {
            const anima = assetsArr[i];

            //include all anima in enemy list
            const enemyLi = document.createElement("li");

            enemyLi.setAttribute("class", "dropdown-item anima-item anima-3");
            enemyLi.innerText = anima.name;
            enemyList.appendChild(enemyLi);
            //only put non-letchin anima in anima selections
            if (anima.spd === parseInt(spdSelection.innerText) && anima.card_type !== "Letchin") {
                const listArray = [animaOneList, animaTwoList, animaThreeList];
                for (let i = 0; i < listArray.length; i++) {
                    const element = listArray[i];
                    const li = document.createElement("li");

                    li.setAttribute("class", `dropdown-item anima-item anima-${i}`);
                    li.innerText = anima.name;
                    element.appendChild(li);
                }
            }
        }
    }
}

getUnitList();

//INIT SIM---------------------------------------
const runSim = function (combatants, enemies, simCount) {
    //Create grid array
    for (let i = 0; i < combatants.length + 1; i++) {
        let row = []
        for (let j = 0; j < enemies.length; j++) {
            if (i === 0) {
                row.push('');
                row.push(enemies[j].name);
            } else {
                row.push('');
            }
        }
        if (i === 0){
        gridArray.push(row);
        } else {
            row.unshift(combatants[0].name);
            gridArray.push(row);
        }
    }
    console.log(gridArray);

    //track the number of rounds
    round = 0;
    while (round < simCount) {
        //para{3} always needs to be 0
        combat(combatants, enemies, 0);
    }
}

//COMBAT-------------------------------------------
const combat = function (combatants, enemies, turn) {
    //global combat vars
    let totalDamage = 0;
    let defense = 0;
    const attackers = combatants.slice();
    const defenders = enemies.slice();
    let defender = defenders[0];

    console.log(attackers[0].name);
    //get total damage for the turn
    attackers.forEach(combatant => {
        const thisCombatantDamage = combatant.getAtkDamage();
        totalDamage += thisCombatantDamage;
        console.log('thisCombatantDamage: ' + thisCombatantDamage)
        console.log('totalDamage: ' + totalDamage)
    });

    //set a target is there are multiple defenders
    if (attackers.length > 0 && !attackers[0].target) {
        attackers[0].pickTarget(defenders);
        defenders[attackers[0].target].setTarget();
    }

    //get def for the turn
    if (attackers[0].hasTarget) {
        defender = defenders[attackers[0].target]
        defense = defender.getDefense();
        console.log("defense: " + defense);
    } else {
        defense = defender.getDefense();
        console.log("defense: " + defense);
    }

    //apply and track damage
    if (totalDamage > defense) {
        console.log('pre damage defenderHp: ' + defender.hp)
        defender.takeDamage(totalDamage - defense);
        attackers.forEach(attacker => {
            let damageFraction = Math.round(attacker.storedAtk - defense / attackers.length);
            if (damageFraction > 0) {
                attacker.upTotalDamage(damageFraction);
            }
            console.log('defenderHp: ' + defender.hp)
        });
    } else if (defense > totalDamage) {
        console.log('no damage to report');
        defender.upTotalExcessDefense(defense - totalDamage);
    }

    if (defender.isAlive()) {
        if (turn % 2 === 0) {
            turn++;
            console.log('combatnat Name' + attackers[0].name);
            combat(combatants, enemies, turn);
        } else {
            turn++;
            console.log('combatnat Name' + attackers[0].name);
            if (turn > 3) {
                turn = 0;
            }
            combat(enemies, combatants, turn);
        }
    } else {
        //End the round
        round++
        const defenderIndex = defenders.findIndex(function (anima) {
            return anima.name === defender.name;
        });
        defenders.splice(defenderIndex, 1);

        //set win/loss
        combatants.forEach(attacker => {
            attacker.setWinLoss(true);
        });
        enemies.forEach(defender => {
            defender.setWinLoss(false);
        });

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
    }
}

//COMPILE DATA-----------------------------------
const compWinLoss = (obj1, obj2) => {
    const obj1WeightedRatio = 0;
}
