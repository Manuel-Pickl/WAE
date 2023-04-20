var playerName;
var playerNumber, enemyNumber;
var playerColor, enemyColor;

var mqttManager;
const host = "test.mosquitto.org";
const port = 8081;
// const topic = "uni/software-project";
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

    changeToWindow(".lobby .choose");
};


// button: create room
var gameInviteInterval;
document.querySelector(".lobby #create").onclick = () => {
    document.querySelector(".lobby .choose").style.visibility = "hidden";
    document.querySelector(".lobby .create").style.visibility = "visible";

    mqttManager.subscribe(`game/${playerName}`);

    gameInviteInterval = setInterval(function () {
        mqttManager.publish(playerName, "games");
    }, 1000);

}


// button: join room
var recieveInvitesInterval;
document.querySelector(".lobby #join").onclick = () => {
    changeToWindow(".lobby .join");

    mqttManager.subscribe("games");

    recieveInvitesInterval = setInterval(function () {
        let listedGames = document.querySelector(".lobby .join");
        listedGames.innerText = null;

        games.forEach(game => {
            var gameName = document.createElement("span");
            gameName.innerText = game;
            
            var joinButton = document.createElement("button");
            joinButton.id = game;
            joinButton.innerText = "join";
            joinButton.onclick = () => joinGame(game);

            let gameElement = document.createElement("div");
            gameElement.classList += "game-entry";
            gameElement.append(gameName);
            gameElement.append(joinButton);

            listedGames.append(gameElement);
        });
    }, 1000);
}


var currentGame;
function joinGame(game) {
    currentGame = game;
    clearInterval(recieveInvitesInterval);

    mqttManager.publish("start", `game/${currentGame}`)
    mqttManager.subscribe(`game/${currentGame}`);

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


var games = new Set();
function handleMessageArrived(message) {
    switch (message.destinationName) {
        case "games":
            let gameName = message.payloadString;
            games.add(gameName);
            break;

        case `game/${playerName}`:
            clearInterval(gameInviteInterval);
            startGame();
    }
}