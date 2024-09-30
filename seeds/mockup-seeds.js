const MockUp = require('../models/MockUp.js');

//mockup arrays
const hpArray = [2, 3, 4, 5];
const baseArray = [0, 1, 2, 3, 4, 5];
const modArray = [4, 6, 8, 10, 12, 20];
const spdArray = [1, 2, 3];
const mockUpArray = [];

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
                                name: `${hpArray[i]}-${baseArray[j]}:${modArray[k]}-${baseArray[l]}:${modArray[m]}-${spdArray[n]}`,
                                card_type: 'mock_up',
                                hp: hpArray[i],
                                base_atk: baseArray[j],
                                atk_mod: modArray[k],
                                base_def: baseArray[l],
                                def_mod: modArray[m],
                                spd: spdArray[n],
                            };
                            mockUpArray.push(mockUp);
                        }
                    }
                }
            }
        }

    }
}


//create a seeding function that will run when called in the index.js
const seedMockUp = () => MockUp.bulkCreate(mockUpArray);

module.exports = seedMockUp;