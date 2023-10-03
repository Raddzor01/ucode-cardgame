const socket = io();

let userData = {};

socket.emit("getUserData", getCookie('token'));

function endTurn() {
        socket.emit("endTurn");
}

socket.on("getNewCard", (data) => {
        console.log(data.name);
});

socket.on("changeTurn", (data) => {
        console.log("changeTurn " + data.mana);
});

socket.on("userData", (data) => {
        userData = data;
        socket.emit("connectToRoom", getCookie('token'));
});

socket.on('youWin', () => {
   // alert("You Win!");
   setTimeout(() =>{document.location.href = "/"}, 200);
});

socket.on('startGame', (data) => {

        const firstPlayer = data[0];
        const secondPlayer = data[1];

        // Получаем имя текущего пользователя
        const currentUserLogin = userData.login;  // используем данные из data
        console.log(firstPlayer);
        console.log(secondPlayer);
        // Получаем контейнеры игроков
        const firstPlayerContainer = document.getElementById('first-player');
        const secondPlayerContainer = document.getElementById('second-player');

        // Проверяем, кто из игроков является текущим пользователем, и заполняем контейнеры соответственно
        if (firstPlayer.login === currentUserLogin) {
                document.getElementById('first_avatar').setAttribute("src", firstPlayer.profile_image);
                document.getElementById('second_avatar').setAttribute("src", secondPlayer.profile_image);
                firstPlayerContainer.classList.add('current-user');
                secondPlayerContainer.classList.remove('current-user');
        } else {
                document.getElementById('first_avatar').setAttribute("src", secondPlayer.profile_image);
                document.getElementById('second_avatar').setAttribute("src", firstPlayer.profile_image);

                secondPlayerContainer.classList.add('current-user');
                firstPlayerContainer.classList.remove('current-user');
        }
});

$(document).ready(function () {
        $(".avatar").on('mousedown', function () {
                // Убедитесь, что класс animate удален перед добавлением, 
                // чтобы можно было повторно запустить анимацию
                $(this).removeClass("animate").addClass("animate");
        });

        // Удалить класс animate по завершении анимации, чтобы можно было запустить анимацию снова
        $(".avatar").on('animationend', function () {
                $(this).removeClass("animate");
        });
});

$(document).ready(function () {
        $(".card").on('mousedown', function () {
                // Убедитесь, что класс animate удален перед добавлением, 
                // чтобы можно было повторно запустить анимацию
                $(this).removeClass("animate_card").addClass("animate_card");
        });

        // Удалить класс animate по завершении анимации, чтобы можно было запустить анимацию снова
        $(".avatar").on('animationend', function () {
                $(this).removeClass("animate_card");
        });
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