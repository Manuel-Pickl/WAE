var playerName, playerId;
// var playerNumber, enemyNumber;
// var playerColor, enemyColor;
var currentGameTopic;

// intervals
var publishInviteInterval;
const publishInviteIntervalMs = 100;
var refreshInvitesInterval;
const refreshInvitesIntervalMs = publishInviteIntervalMs * 3;

var games = new Set();
var lastGames = new Set();

var mqttManager;
const host = "test.mosquitto.org";
const port = 8081;
const topic = "4af3fb39-ae8e-43ac-9b2a-c31eb21004ff";


initializeBroker();


// button: enter name
document.querySelector(".lobby #submit-name").onclick = () => {
    var input = document.querySelector(".lobby .login input");
    if (input.value.length == 0) {
        alert("insert your name");
        input.focus();
        return;
    }

    playerName = input.value;
    playerId = crypto.randomUUID();

    changeToWindow(".lobby .choose");
};


// button: create room
document.querySelector(".lobby #create").onclick = () => {
    document.querySelector(".lobby .choose").style.visibility = "hidden";
    document.querySelector(".lobby .create").style.visibility = "visible";

    mqttManager.subscribe(`game/${playerId};${playerName}`);

    publishInviteInterval = setInterval(function () {
        mqttManager.publish(`${playerId};${playerName}`, "games");
    }, publishInviteIntervalMs);

}


// button: join room
document.querySelector(".lobby #join").onclick = () => {
    changeToWindow(".lobby .join");

    mqttManager.subscribe("games");

    let listedGames = document.querySelector(".lobby .join");
    refreshInvitesInterval = setInterval(function () {
        if (!setsAreEqual(games, lastGames)) {
            listedGames.innerText = null;

            games.forEach(game => {
                var gameName = document.createElement("span");
                gameName.innerText = game.split(";")[1];
                
                var joinButton = document.createElement("button");
                joinButton.innerText = "join";
                joinButton.onclick = () => joinGame(game);

                let gameElement = document.createElement("div");
                gameElement.classList += "game-entry";
                gameElement.append(gameName);
                gameElement.append(joinButton);

                listedGames.append(gameElement);
            });
        }

        lastGames = new Set(games);
        games.clear();
    }, refreshInvitesIntervalMs);
}


function joinGame(game) {
    currentGameTopic = game;
    clearInterval(refreshInvitesInterval);

    mqttManager.unsubscribe("games");
    mqttManager.publish("start", `game/${currentGameTopic}`)
    mqttManager.subscribe(`game/${currentGameTopic}`);

    startGame();
}



function startGame() {
    changeToWindow(".game");

    // initializeVariables();
    console.log("game initialized");
}


function initializeBroker() {
    mqttManager = new MQTTManager(host, port);
    mqttManager.connect();
}


function handleMessageArrived(message) {
    switch (message.destinationName) {
        case "games":
            let gameName = message.payloadString;
            games.add(gameName);
            break;

        case `game/${playerId};${playerName}`:
            clearInterval(publishInviteInterval);
            startGame();
    }
}