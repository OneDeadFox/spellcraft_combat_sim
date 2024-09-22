export default class Unit {
    constructor(obj) {
        const { id, number, name, card_type, rarity, element_type, ability, race, anima_class, cost, card_class, casting_rng, plot_spd, hp, atk, def, spd, movement, size, action, slot, marker } = obj;
        this.id = id
        this.number = number
        this.name = name;
        this.cardType = card_type;
        this.rarity = rarity;
        this.elementType = element_type;
        this.ability = ability;
        this.animaType = ((anima_class !== null) ? `${race} ${anima_class}` : race);
        this.cost = cost;
        this.cardClass = card_class;
        this.castingRange = casting_rng;
        this.plotSpeed = plot_spd;
        this.hp = hp;
        this.orgHp = hp;
        this.baseAtk = parseInt(atk.match(/(\d+):/).pop());
        this.atkMod = parseInt(atk.match(/:(\d+)/).pop());
        this.baseDef = parseInt(def.match(/(\d+):/).pop());
        this.defMod = parseInt(def.match(/:(\d+)/).pop());;
        this.spd = spd;
        this.movement = movement;
        this.size = size;
        this.action = action;
        this.slot = slot;
        this.marker = marker;
        this.totalWins = 0;
        this.totalLoses = 0;
        this.totalDamage = 0;
        this.totalExcessDefense = 0;
        this.isTarget = false;
        this.target = false;
        this.storedAtk = 0;
        this.storedDef = 0;
    }

    rollAtkMod() {
        const atkRoll = Math.round(Math.random() * (this.atkMod - 1) + 1);
        return atkRoll;
    }

    rollDefMod() {
        const defRoll = Math.round(Math.random() * (this.defMod - 1) + 1);
        return defRoll;
    }

    getAtkDamage() {
        if (this.hp > 0) {
            const mod = this.rollAtkMod();
            const atkDamage = this.baseAtk + mod;
            this.storedAtk = atkDamage;

            return atkDamage;
        } else {
            return 0;
        }
    }

    getDefense() {
        if (this.hp > 0) {
            const mod = this.rollDefMod();
            const defense = this.baseDef + mod;
            this.storedDef = defense;

            return defense;
        } else {
            return 0;
        }
    }

    takeDamage(damage) {
        this.hp = this.hp - damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
        return this.hp
    }

    isAlive() {
        if (this.hp > 0) {
            return true;
        } else {
            return false;
        }
    }

    upTotalDamage(num) {
        this.totalDamage = this.totalDamage + num;
        return this.totalDamage
    }

    upTotalExcessDefense(num) {
        this.totalExcessDefense = this.totalExcessDefense + num;
        return this.totalExcessDefense
    }

    pickTarget(targets) {
        const target = Math.round(Math.random() * (targets.length - 1));

        this.target = target;
        targets[target].isTarget = true;

        return target;
    }

    setTarget() {
        this.isTarget = true;
        return this.isTarget;
    }

    setWinLoss(bool) {
        //increase totalwins or loses
        if (bool) {
            this.totalWins++;
        } else {
            this.totalLoses++;
        }
        return bool;
    }

    report() {
        const returnObj = {
            id: this.id,
            name: this.name,
            totalWins: this.totalWins,
            totalLoses: this.totalLoses,
            hp: this.hp,
            totalDamage: this.totalDamage,
            totalExcessDefense: this.totalExcessDefense,
            isTarget: this.isTarget,
            target: this.target
        }

        return (returnObj)
    }

    reset() {
        //reset hp and all other trackers
        this.hp = this.orgHp;
        this.isTarget = false;
        this.target = false;

        const returnObj = {
            id: this.id,
            name: this.name,
            totalWins: this.totalWins,
            totalLoses: this.totalLoses,
            hp: this.hp,
            totalDamage: this.totalDamage,
            totalExcessDefense: this.totalExcessDefense,
            isTarget: this.isTarget,
            target: this.target
        }

        return (returnObj)
    }
}
