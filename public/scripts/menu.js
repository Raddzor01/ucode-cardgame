let socket = io();

socket.emit("getUserData", getCookie('token'));
socket.on("userData", (data) => {
    document.querySelector('.user_name').textContent = data.login;
    // document.querySelector('.card img').setAttribute('src', data.picture_path);
    document.querySelector('.wins').textContent = "Wins: " +  data.wins;
    document.querySelector('.loses').textContent = "Loses: " + data.loses;
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