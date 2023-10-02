const socket = io();

let userData = {};

socket.emit("getUserData", getCookie('token'));

socket.on("userData", (data) => {
        userData = data;
        socket.emit("connectToRoom", getCookie('token'));
});


socket.on('startGame', (data) => {
        console.log('startGame event received:', data);
        console.log(userData);
        const firstPlayer = data[0];
        const secondPlayer = data[1];
        console.log(data[0]);
        console.log(data[1]);
        // Получаем имя текущего пользователя
        const currentUserLogin = userData.Login;  // используем данные из data

        // Получаем контейнеры игроков
        const firstPlayerContainer = document.getElementById('first-player');
        const secondPlayerContainer = document.getElementById('second-player');

        // Проверяем, кто из игроков является текущим пользователем, и заполняем контейнеры соответственно
        if (firstPlayer.login === currentUserLogin) {
                document.getElementById('first-player-login').textContent = firstPlayer.login;
                document.getElementById('second-player-login').textContent = secondPlayer.login;  // Добавлено
                // ваш аватар будет всегда снизу
                firstPlayerContainer.classList.add('current-user');
                secondPlayerContainer.classList.remove('current-user');
        } else {
                document.getElementById('first-player-login').textContent = firstPlayer.login;  // Добавлено
                document.getElementById('second-player-login').textContent = secondPlayer.login;
                // ваш аватар будет всегда снизу
                secondPlayerContainer.classList.add('current-user');
                firstPlayerContainer.classList.remove('current-user');
        }

        // Заполняем остальные данные первого и второго игроков
        // ...
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