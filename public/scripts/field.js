const socket = io();

let userData;

socket.emit("getUserData", getCookie('token'));
socket.emit("connectToRoom",getCookie('token'));

socket.on("userData", (data) => {
        userData = data;
});

socket.on('startGame', (data) => {
        console.log(data);
});

function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
                const [cookieName, cookieValue] = cookie.trim().split('=');
                if (cookieName === name) {
                        return decodeURIComponent(cookieValue);
                }
        }
        return null;
}