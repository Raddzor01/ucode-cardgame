import Model from "./Model.js";

export class Card extends Model {
    constructor(table) {
        super(table);
    }

    async find(id) {
        const data = await super.find(id);
        this.id = data[0].id;
        this.name = data[0].name;
        this.mana = data[0].mana;
        this.damage = data[0].damage;
        this.hp = data[0].hp;
        this.picture_path = data[0].picture_path;
    }

    async save(data) {
        let result = await super.save(data);
        if(typeof result === "number")
            return this.find(result);
    }
}