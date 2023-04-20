function initializeVariables() {
    // determine player/enemy number & color
    enemyNumber = 3 - playerNumber;
    playerColor = playerNumber == 1 ? "blue" : "red";
    enemyColor = playerNumber == 1 ? "red" : "blue";
}


document.querySelectorAll("td").forEach(td => {
    td.onclick = () => onPlayerMove(td.id);
});


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
