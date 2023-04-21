document.querySelectorAll("td").forEach(td => {
    td.onclick = () => onPlayerMove(td.id);
});


function onPlayerMove(tileNumber) {
    // publish move
    mqttWrapper.publish(tileNumber, connectionManager.playerTopic);

    // color tile
    document.getElementById(tileNumber).style.background = "blue";
}

function onEnemyMove(tileNumber) {
    // color tile
    document.getElementById(tileNumber).style.background = "green";
}
