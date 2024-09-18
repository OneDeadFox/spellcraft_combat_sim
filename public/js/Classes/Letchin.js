export class Letchin {
    constructor( 
        number,
        name, 
        cardType, 
        rarity, 
        elementType, 
        ability, 
        animaType,
        hp,
        atk,
        def,
        spd,
        movement,
        size,
        action,
        wellsAdded,
        cardsDrawn,
        treasuresDrawn,
        marker
    ) {
        this.number = number;
        this.name = name;
        this.cardType = cardType;
        this.rarity = rarity;
        this.elementType = elementType;
        this.ability = ability;
        this.animaType = animaType;
        this.hp = hp;
        this.baseatk = parseInt(atk.match(/(\d+):/).pop());
        this.atkMod = parseInt(atk.match(/:(\d+)/).pop());
        this.def = def;
        this.spd = spd;
        this.movement = movement;
        this.size = size;
        this.action = action;
        this.wellsAdded = wellsAdded;
        this.cardsDrawn = cardsDrawn;
        this.treasuresDrawn = treasuresDrawn;
        this.marker = marker;
    }

    rollAtkMod(){

    }
}
