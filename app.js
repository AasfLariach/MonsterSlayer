//Function which return random attack value between min to max
function getRandomAttackValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
data(){
    return {
        playerHealth: 100,
        monsterHealth: 100,
        currentRound: 0,
        winner: null,
        battleLogMessages: []
    };
},
computed: {
    //Function which return the monster bar div styles object
    monsterBarStyles() {
        if (this.monsterHealth < 0){
            return {width: '0%'};
        } else {
            return {width: this.monsterHealth + '%'};
        }
    },

    //Function which return the player bar div styles object
    playerBarStyles() {
        if(this.playerHealth < 0 || this.winner === 'monster'){
            return {width: '0%'};
        } else {
            return {width: this.playerHealth + '%'};
        }

    },

    //function which return true if special attack is available, false otherwise
    mayUseSpecialAttack() {
        return this.currentRound % 3 !== 0; //Special attack is available every 3 rounds
    }
},
watch: {
    //This watcher checks the status of player health
    playerHealth(value) {
        if (value <= 0 && this.monsterHealth <= 0) {
            //A draw
            this.winner = 'draw';
        } else if (value <= 0){
            //Player lost
            this.winner = 'monster';
        }
    },

    //This watcher checks the status of monster health
    monsterHealth(value) {
        if (value <= 0 && this.playerHealth <= 0) {
            //A draw
            this.winner = 'draw';
        } else if (value <= 0){
            //Monster lost
            this.winner = 'player';
        }
    }
},
methods: {
    //Function which reset all data to start a new game
    startGame() {
        this.playerHealth = 100;
        this.monsterHealth = 100;
        this.winner = null;
        this.currentRound = 0;
        this.battleLogMessages = [];
    },

    //Function which reduce the monster health by random value between 5 - 12 
    attackMonster() {
        const attackValue = getRandomAttackValue(5, 12);
        this.monsterHealth -= attackValue;
        this.addLogMessage('player', 'attack', attackValue);//Insert the action to LOG
        this.attackPlayer();//Monster attack back
        this.currentRound++;//Increment round number
    },

    //Function which reduce the player health by random value between 8 - 15 
    attackPlayer() {
        const attackValue = getRandomAttackValue(8, 15);
        this.playerHealth -= attackValue;
        this.addLogMessage('monster', 'attack', attackValue);//Insert the action to LOG
    },

    //Function which reduce the monster health by random value between 10 - 25 
    specialAttackMonster() {
        const attackValue = getRandomAttackValue(10, 25);
        this.monsterHealth -= attackValue;
        this.addLogMessage('player', 'attack', attackValue);//Insert the action to LOG
        this.attackPlayer();//Monster attack back
        this.currentRound++;//Increment round number
    },

    //Function which heal the player health by random value between 8 - 20 
    healPlayer() {
        const healValue = getRandomAttackValue(8, 20);
        if((this.playerHealth + healValue) > 100) {
            this.playerHealth = 100;
        } else {
            this.playerHealth += healValue;
        }
        this.addLogMessage('player', 'heal', healValue);//Insert the action to LOG
        this.attackPlayer();//Monster attack back
        this.currentRound++;//Increment round number
    },

    //Function which set the monster as the winner of the game
    surrender() {
        this.winner = 'monster'
    },

    //Function which insert the last action to the top of the battle log array
    addLogMessage(actor, action, value) {
        this.battleLogMessages.unshift({
            actionBy: actor,
            actionType: action,
            actionValue: value
        });
    }
}

});

app.mount('#game');