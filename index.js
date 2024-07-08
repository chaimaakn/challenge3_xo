const xbg = document.getElementById('x-img-id');
const obg = document.getElementById('o-img-id');
const xSelect = document.getElementById('x');
const oSelect = document.getElementById('o');

// Mark and color
const O_MARK = ["./assets/icon-o-grey.png", '#FFC860', 'playerO', './assets/icon-o-grey.png', "url('./assets/icon-o-grey.png')"];
const X_MARK = ["./assets/icon-x-grey.png", '#31C3BD', 'playerX', './assets/icon-x-grey.png', "url('./assets/icon-x-grey.png')"];

// Assign user and computer
let user = O_MARK
let computer = X_MARK

// clear before storage
sessionStorage.clear()
// store variable for us in other sessions
sessionStorage.setItem("user", JSON.stringify(O_MARK))
sessionStorage.setItem("computer", JSON.stringify(X_MARK))

// toggles
const toggleX = () => {
    xbg.style.backgroundColor = '#A8BFC9'
    xSelect.style.filter = 'invert(12%) sepia(12%) saturate(1823%) hue-rotate(157deg) brightness(96%) contrast(90%)'
    obg.style.backgroundColor = '#1A2A33'
    oSelect.style.filter = 'invert(79%) sepia(32%) saturate(145%) hue-rotate(153deg) brightness(90%) contrast(89%)'
    sessionStorage.setItem("user", JSON.stringify(X_MARK))
    sessionStorage.setItem("computer", JSON.stringify(O_MARK))
}

const toggleO = () => {
    obg.style.backgroundColor = '#A8BFC9'
    oSelect.style.filter = 'invert(12%) sepia(12%) saturate(1823%) hue-rotate(157deg) brightness(96%) contrast(90%)'
    xbg.style.backgroundColor = '#1A2A33'
    xSelect.style.filter = 'invert(79%) sepia(32%) saturate(145%) hue-rotate(153deg) brightness(90%) contrast(89%)'
    sessionStorage.setItem("user", JSON.stringify(O_MARK))
    sessionStorage.setItem("computer", JSON.stringify(X_MARK))
}

xbg.addEventListener('click', toggleX)
obg.addEventListener('click', toggleO)
