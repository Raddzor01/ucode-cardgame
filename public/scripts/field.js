const socket = io();

let userData;

socket.emit("getUserData", getCookie('token'));
socket.emit("connectToRoom", getCookie('token'));

socket.on("userData", (data) => {
        userData = data;
        console.log(data);
});

socket.on('startGame', (data) => {
        const firstPlayer = data[0];
        const secondPlayer = data[1];
    
        // Получаем имя текущего пользователя (замените на реальное имя пользователя)
        const currentUserLogin = 'Имя пользователя';
    
        // Получаем контейнеры игроков
        const firstPlayerContainer = document.getElementById('first-player-container');
        const secondPlayerContainer = document.getElementById('second-player-container');
    
        if (firstPlayer.login === userData.login) {
            // Если текущий пользователь - первый игрок, помещаем его контейнер вниз
            firstPlayerContainer.style.order = '2';
            secondPlayerContainer.style.order = '1';
        } else {
            // Если текущий пользователь - второй игрок, помещаем его контейнер вниз
            firstPlayerContainer.style.order = '1';
            secondPlayerContainer.style.order = '2';
        }
    
        // Заполняем данные первого игрока
        document.getElementById('first-player-login').textContent = firstPlayer.login;
        // Остальные данные firstPlayer
    
        // Заполняем данные второго игрока
        document.getElementById('second-player-login').textContent = secondPlayer.login;
        // Остальные данные secondPlayer
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