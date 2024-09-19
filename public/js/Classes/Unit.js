export class Unit {
    constructor( 
        number,
        name, 
        cardType, 
        rarity, 
        elementType, 
        ability, 
        animaType, 
        cost, 
        cardClass, 
        castingRange, 
        plotSpeed, 
        hp,
        atk,
        def,
        spd,
        movement,
        size,
        action,
        slot,
        marker
    ) {
        this.number = number
        this.name = name;
        this.cardType = cardType;
        this.rarity = rarity;
        this.elementType = elementType;
        this.ability = ability;
        this.animaType = animaType;
        this.cost = cost;
        this.cardClass = cardClass;
        this.castingRange = castingRange;
        this.plotSpeed = plotSpeed;
        this.hp = hp;
        this.baseatk = parseInt(atk.match(/(\d+):/).pop());
        this.atkMod = parseInt(atk.match(/:(\d+)/).pop());
        this.def = def;
        this.spd = spd;
        this.movement = movement;
        this.size = size;
        this.action = action;
        this.slot = slot;
        this.marker = marker;
    }

    rollAtkMod(){

    }
}
