const windows = [ 
    ".lobby .login",
    ".lobby .choose",
    ".lobby .create",
    ".lobby .join",
    ".game"
];

const enterNameElement = document.querySelector(".lobby #submit-name");
const createRoomElement = document.querySelector(".lobby #create");
const joinLobbyElement = document.querySelector(".lobby #join");
const openRoomsElement = document.querySelector(".lobby .join");

function changeToWindow(windowClasses) {
    windows.forEach(window => {
        document.querySelector(window).style.visibility = "hidden";
    })
    document.querySelector(windowClasses).style.visibility = "visible";
}