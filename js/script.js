var playerNumber, enemyNumber;
var playerColor, enemyColor;

var mqttManager;
// const host = "broker.mqttdashboard.com";
// const port = 8000;
const host = "test.mosquitto.org";
const port = 8081;


// bind events
document.querySelectorAll("button").forEach(button => {
    button.onclick = () => {
        // select player
        playerNumber = button.id;
        console.log("selected player", playerNumber);
        
        startGame();
    }
});

document.querySelectorAll("td").forEach(td => {
    td.onclick = () => onPlayerMove(td.id);
});



function startGame() {
    changeToGameBoard();
    initializeVariables();
    initializeBroker();
    console.log("game initialized");
}

function changeToGameBoard() {
    // hide buttons & make board visible
    document.querySelectorAll("button").forEach(button => button.style.display = "none");
    document.querySelector("table").style.visibility = "visible";
}

function initializeVariables() {
    // determine player/enemy number & color
    enemyNumber = 3 - playerNumber;
    playerColor = playerNumber == 1 ? "blue" : "red";
    enemyColor = playerNumber == 1 ? "red" : "blue";
}

function initializeBroker() {
    // initialize broker
    mqttManager = new MQTTManager(host, port);
    let topic = "uni/software-project";
    mqttManager.pubTopic = `${topic}/${playerNumber}`;
    mqttManager.subTopic = `${topic}/${enemyNumber}`;

    // connect to broker
    mqttManager.connect();
}



function onPlayerMove(tileNumber) {
    // publish move
    mqttManager.publishMessage(tileNumber);

    // color tile
    document.getElementById(tileNumber).style.background = playerColor;
}

function onEnemyMove(tileNumber) {
    // color tile
    document.getElementById(tileNumber).style.background = enemyColor;
}