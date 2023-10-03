const socket = io();

let userData = {};

socket.emit("getUserData", getCookie('token'));

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
        setTimeout(() => { document.location.href = "/" }, 200);
});

startTimer();

function startTimer() {
        let remainingTime = 60;
        document.querySelector(".timer").textContent = "60s";

        const timerInterval = setInterval(() => {
                remainingTime--;
                document.querySelector(".timer").textContent = remainingTime + "s";

                if (remainingTime <= 0) {
                        clearInterval(timerInterval);
                        endTurn();
                }
        }, 1000);
}

function endTurn() {
        socket.emit("endTurn");
}


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
                document.getElementById('first_player_login').innerHTML = firstPlayer.login;
                document.getElementById('second_player_login').innerHTML = secondPlayer.login;

                document.getElementById('first_avatar').setAttribute("src", firstPlayer.profile_image);
                document.getElementById('second_avatar').setAttribute("src", secondPlayer.profile_image);

                firstPlayerContainer.classList.add('current-user');
                secondPlayerContainer.classList.remove('current-user');

                data[0].startCards.forEach((card) => {
                        createCard(card);
                });


        } else {
                document.getElementById('first_player_login').innerHTML = secondPlayer.login;
                document.getElementById('second_player_login').innerHTML = firstPlayer.login;
                document.getElementById('first_avatar').setAttribute("src", secondPlayer.profile_image);
                document.getElementById('second_avatar').setAttribute("src", firstPlayer.profile_image);

                secondPlayerContainer.classList.add('current-user');
                firstPlayerContainer.classList.remove('current-user');

                data[1].startCards.forEach((card) => {
                        createCard(card);
                });
        }

        console.log(firstPlayer.startCards);
        console.log(secondPlayer.startCards);
});

function createCard(cardData) {
        // Создаем главный div для карты
        console.log(cardData);
        const cardDiv = document.createElement('div');
        cardDiv.className = "card";
        cardDiv.id = "btn-div";

        // Создаем div для стоимости маны
        const manaCostDiv = document.createElement('div');
        manaCostDiv.className = "mana_cost";
        manaCostDiv.textContent = cardData.mana; // Предполагая, что у вас есть поле mana_cost в данных карты
        cardDiv.appendChild(manaCostDiv);

        // Создаем p для имени карты
        const cardNameP = document.createElement('p');
        cardNameP.className = "cardname";
        cardNameP.textContent = cardData.name; // Предполагая, что у вас есть поле name в данных карты
        cardDiv.appendChild(cardNameP);

        // Создаем img для изображения карты
        const cardImg = document.createElement('img');
        cardImg.className = "card_img";
        cardImg.src = cardData.picture_path; // Предполагая, что у вас есть поле image_url в данных карты
        cardImg.alt = cardData.name;
        cardDiv.appendChild(cardImg);

        // Создаем div для атаки
        const attackDiv = document.createElement('div');
        attackDiv.className = "attack";
        attackDiv.textContent = cardData.damage; // Предполагая, что у вас есть поле attack в данных карты
        cardDiv.appendChild(attackDiv);

        // Создаем div для здоровья
        const hpDiv = document.createElement('div');
        hpDiv.className = "hp";
        hpDiv.textContent = cardData.hp; // Предполагая, что у вас есть поле hp в данных карты
        cardDiv.appendChild(hpDiv);

        // Добавляем готовую карту в контейнер на странице (предполагая, что у вас есть контейнер с id="cards-container")
        document.getElementById('player1_cards').appendChild(cardDiv);
        activateDragAndDrop(cardDiv);
}

function activateDragAndDrop(cardElement) {
        var $container = $("#player1-area"),
                gridWidth = 150,
                gridHeight = 250,
                gridRows = 1,
                gridColumns = 7,
                i, x;

                let containerWidth = $container.width(),
                totalDivsWidth = (gridColumns * gridWidth) + (gridColumns - 1) * 10, // Добавляем отступы
                leftOffset = (containerWidth - totalDivsWidth) / 2;
            
            if ($(".dropzone").length === 0) {
                for (i = 0; i < gridColumns; i++) {
                    x = i * (gridWidth + 20) + leftOffset; // Учитываем отступ
                    $("<div/>").css({
                        position: "absolute",
                        border: "1px solid #454545",
                        width: gridWidth - 1,
                        height: gridHeight - 1,
                        top: 5,
                        left: x,
                        zIndex: -9999
                    }).prependTo($container).addClass("dropzone");
                }
            }
            

        let startPosition = {};

        // Используем переданный элемент cardElement вместо .card
        $(cardElement).draggable({
                revert: "invalid",
                start: function (event, ui) {
                        console.log("Drag started");
                        startPosition = $(this).position();
                        ui.helper.css({
                                "transition": "none",
                        });
                },
                stop: function (event, ui) {
                        console.log("Drag stopped");
                        ui.helper.css({
                                "transition": "all 0.3s ease-in-out",
                        });
                }
        });

        $(".dropzone").droppable({
                accept: ".card",
                drop: function (event, ui) {
                        ui.draggable.data('dropped', true);
                        console.log("Card was dropped into a dropzone");

                        ui.draggable.draggable("disable");
                        ui.draggable.css({
                                "cursor": "default",
                                "left": "",
                                "top": "",
                                "position": "relative",
                                "transform": "none"
                        });

                        $(this).append(ui.draggable);
                }
        });
}

$(document).ready(function () {
<<<<<<< HEAD
        $(".avatar").on('mousedown', function () {
                $(this).removeClass("animate").addClass("animate");
        });

        $(".avatar").on('animationend', function () {
=======
        $(".avatar_container").on('mousedown', function () {
                // Убедитесь, что класс animate удален перед добавлением, 
                // чтобы можно было повторно запустить анимацию
                $(this).removeClass("animate").addClass("animate");
        });

        // Удалить класс animate по завершении анимации, чтобы можно было запустить анимацию снова
        $(".avatar_container").on('animationend', function () {
>>>>>>> 45a76c44401137e4d790c095dd6352d595057680
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