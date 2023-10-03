class Card {
    constructor(id, name, attack, health) {
        this.id = id;
        this.name = name;
        this.attack = attack;
        this.health = health;
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    isAlive() {
        return this.health > 0;
    }
}

class Player {
    constructor() {
        this.hand = [];
        this.mana = 0;
    }

    draw(deck, count) {
        for (let i = 0; i < count; i++) {
            if (deck.length > 0) {
                this.hand.push(deck.pop());
            }
        }
    }

    gainMana(amount) {
        this.mana += amount;
    }

    attackCardWithCard(attackerCard, defenderCard) {
        defenderCard.takeDamage(attackerCard.attack);
        attackerCard.takeDamage(defenderCard.attack);

        this.hand = this.hand.filter(card => card.isAlive());
    }

    attackPlayerWithCard(attackerCard, targetPlayer) {
        targetPlayer.takeDamage(attackerCard.attack);
    }

    takeDamage(damage) {
        this.health -= damage;
    }
}

class GameController {
    constructor(players, deck) {
        this.players = players; 
        this.deck = deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    startGame() {
        this.shuffleDeck();

        for (const player of this.players) {
            player.draw(this.deck, 3);
            player.gainMana(1);
        }
    }

    playTurn(player) {
        player.draw(this.deck, 1);
        player.gainMana(1);

        const opponent = this.players.find(p => p !== player);
        
        //реализовать нормальную атаку игроком а пока что будет эта затычка
        const attackingCard = player.hand[0];
        const defendingCard = opponent.hand[0];

        if (defendingCard) {
            player.attackCardWithCard(attackingCard, defendingCard);
        } else {
            player.attackPlayerWithCard(attackingCard, opponent);
        }
    }

    playGame() {
        this.startGame();
    
        let isFirstPlayerTurn = true;
    
        while (this.players.every(player => player.isAlive())) {
            const currentPlayer = isFirstPlayerTurn ? this.players[0] : this.players[1];
            this.playTurn(currentPlayer);
            
            // Переключаемся на следующего игрока
            isFirstPlayerTurn = !isFirstPlayerTurn;
        }
    
        console.log("Game over!");
    }
    
}

const players = [new Player(), new Player()];

const deck = [
    // взять из бд
];

const game = new GameController(players, deck);
game.playGame();

