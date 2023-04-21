const host = "test.mosquitto.org";
const port = 8081;

var mqttWrapper;
var connectionManager;

window.onload = () => initialize();

//#region ui event bindings

// button: enter name
enterNameElement.onclick = () => {
    var input = document.querySelector(".lobby .login input");
    if (input.value.length == 0) {
        alert("insert your name");
        input.focus();
        return;
    }

    connectionManager.initialize(input.value);
    changeToWindow(".lobby .choose");
};

// button: create room
createRoomElement.onclick = () => {
    connectionManager.createRoom();
    changeToWindow(".lobby .create");
}

// button: join room
joinLobbyElement.onclick = () => {
    changeToWindow(".lobby .join");
    connectionManager.showOpenRooms();
}

//#endregion

function initialize() {
    mqttWrapper = new MQTTWrapper(host, port);
    mqttWrapper.connect();
    
    connectionManager = new ConnectionManager(mqttWrapper);
    connectionManager.onOpenRoomsRefresh = refreshOpenRooms;
    connectionManager.onConnectionEstablished = startGame;
    connectionManager.onEnemyMove = onEnemyMove;
}

function refreshOpenRooms(openRooms) {
    openRoomsElement.innerText = null;

    openRooms.forEach(game => {
        var gameName = document.createElement("span");
        gameName.innerText = game.split(";")[1];
        
        var joinButton = document.createElement("button");
        joinButton.innerText = "join";
        joinButton.onclick = () => this.joinGame(game);

        let gameElement = document.createElement("div");
        gameElement.classList += "game-entry";
        gameElement.append(gameName);
        gameElement.append(joinButton);

        openRoomsElement.append(gameElement);
    });
}

function startGame() {
    changeToWindow(".game");
}