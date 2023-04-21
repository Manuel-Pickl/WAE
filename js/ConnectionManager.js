class ConnectionManager {
    playerTopic;
    enemyTopic;
    enemyName() { return this.enemyTopic.split(";")[1] };

    //#region events

    /**
     * Event that fires periodically and returns the open room topics
     * @returns An array of the open room topics
     */
    onOpenRoomsRefresh() {};

    /**
     * Event that fires when the connection with the enemy is established
     */
    onConnectionEstablished() {};

    /**
     * Event that fires when your enemy made a move
     * @returns The tile your chose
     */
    onEnemyMove() {};

    //#endregion

    #mqttWrapper;
    #applicationGuid;
    #playerId;
    #games;
    #lastGames;
    
    // intervals
    #publishInviteInterval;
    #publishInviteIntervalMs;
    #refreshInvitesInterval;
    #refreshInvitesIntervalMs;

    constructor(mqttWrapper) {
        this.mqttWrapper = mqttWrapper;
        this.applicationGuid = "4af3fb39-ae8e-43ac-9b2a-c31eb21004ff"
        
        this.mqttWrapper.onMessage = (message) => this.onMessageArrived(message);
    }

    initialize(playerName) {
        this.playerId = crypto.randomUUID();
        this.playerTopic = `${this.playerId};${playerName}`;

        this.publishInviteIntervalMs = 100;
        this.refreshInvitesIntervalMs = 300;
        
        this.games = new Set();
        this.lastGames = new Set();
    }

    createRoom() {
        this.mqttWrapper.subscribe(this.playerTopic);

        this.publishInviteInterval = setInterval(function () {
            this.mqttWrapper.publish(this.playerTopic, "games");
        }.bind(this), this.publishInviteIntervalMs);
    }

    showOpenRooms() {
        this.mqttWrapper.subscribe("games");

        this.refreshInvitesInterval = setInterval(function () {
            if (!this.setsAreEqual(this.games, this.lastGames)) {
                this.onOpenRoomsRefresh(this.games);
            }

            this.lastGames = new Set(this.games);
            this.games.clear();
        }.bind(this), this.refreshInvitesIntervalMs);
    }

    joinGame(enemyTopic) {
        this.enemyTopic = enemyTopic;
        clearInterval(this.refreshInvitesInterval);
    
        this.mqttWrapper.unsubscribe("games");
        this.mqttWrapper.publish(this.playerTopic, this.enemyTopic)
        this.mqttWrapper.subscribe(this.enemyTopic);
    
        console.log(`connection established with player ${this.enemyName()}`);
        this.onConnectionEstablished();
    }

    onMessageArrived(message) {
        switch (message.destinationName) {
            case "games":
                let gameName = message.payloadString;
                this.games.add(gameName);
                break;
    
            case this.playerTopic:
                clearInterval(this.publishInviteInterval);
                this.enemyTopic = message.payloadString;
                this.mqttWrapper.unsubscribe(this.playerTopic);
                this.mqttWrapper.subscribe(this.enemyTopic);
                
                console.log(`connection established with player ${this.enemyName()}`);
                this.onConnectionEstablished();
                break;
            
            case this.enemyTopic:
                this.onEnemyMove(message.payloadString);
                break;
        }
    }

    setsAreEqual = (set1, set2) =>
        set1.size === set2.size
        && [...set1].every((x) => set2.has(x));
}