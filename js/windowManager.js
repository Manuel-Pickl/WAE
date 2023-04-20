const windows = [ 
    ".lobby .login",
    ".lobby .choose",
    ".lobby .create",
    ".lobby .join",
    ".game"
];

function changeToWindow(windowClasses) {
    windows.forEach(window => {
        document.querySelector(window).style.visibility = "hidden";
    })
    document.querySelector(windowClasses).style.visibility = "visible";
}