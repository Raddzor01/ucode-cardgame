const socket = io();

let userData = {};

let timerInterval = null;
let firstPlayer = null;
let secondPlayer = null;
let currentPlayer = null;

socket.emit("getUserData", getCookie('token'));

function attack() {
        // socket.emit("attack", {ownSlotIndex: 2, ownCardId: 3, enemySlotIndex: -1 }); // - отправка запроса
}
socket.on("enemyAttack", (data) => { console.log("enemyAttack" + data) }); // - прием запроса если противиник атаковал

socket.on("getNewCard", (data) => {
        console.log(data);
        createCard(data, true);

});

socket.on("changeTurn", (data) => {
        console.log("changeTurn " + data.mana);

        if (timerInterval) {
                clearInterval(timerInterval);
        }
        createEnemyCard(true);

        // Меняем ход
        if (currentPlayer === firstPlayer) {
                currentPlayer = secondPlayer;

        } else {
                currentPlayer = firstPlayer;
        }

        console.log(currentPlayer.login + " your turn");
        startTimer();
        minusCountCards();
});

socket.on("userData", (data) => {
        userData = data;
        socket.emit("connectToRoom", getCookie('token'));
});

socket.on('youWin', () => {
        alert("You Win!");
        setTimeout(() => { document.location.href = "/" }, 200);
});

socket.on('youLose', () => {
        alert("You Lose!");
        setTimeout(() => { document.location.href = "/" }, 200);
});

socket.on('placeEnemyCard', (data) => {
        console.log(data);
        createCardSlots();
        displayEnemyCard(data);
        removeEnemyCard();
});

function beginTurnForPlayer(player) {
        currentPlayer = player;
        if (player.firstTurn === true) {
                startTimer();
        }
}

function startTimer() {
        let remainingTime = 60;
        document.querySelector(".timer").textContent = "60s";

        timerInterval = setInterval(() => {
                remainingTime--;
                document.querySelector(".timer").textContent = remainingTime + "s";

                if (remainingTime <= 0) {
                        endTurn();
                }
        }, 1000);
}

function endTurn() {
        if (timerInterval) {
                clearInterval(timerInterval);
        }
        socket.emit("endTurn");

        // Меняем ход
        if (currentPlayer === firstPlayer) {
                currentPlayer = secondPlayer;

        } else {
                currentPlayer = firstPlayer;
        }
        startTimer();
        minusCountCards();
}

socket.on('startGame', (data) => {

        firstPlayer = data[0];
        secondPlayer = data[1];

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

                addThreePlayerCards(data[0]);
                activateDragAndDrop(".card");
                addThreeEnemyCards();

        } else {
                document.getElementById('first_player_login').innerHTML = secondPlayer.login;
                document.getElementById('second_player_login').innerHTML = firstPlayer.login;
                document.getElementById('first_avatar').setAttribute("src", secondPlayer.profile_image);
                document.getElementById('second_avatar').setAttribute("src", firstPlayer.profile_image);

                secondPlayerContainer.classList.add('current-user');
                firstPlayerContainer.classList.remove('current-user');

                addThreePlayerCards(data[0]);
                activateDragAndDrop(".card");
                addThreeEnemyCards();
        }

        if (firstPlayer.firstTurn) {
                beginTurnForPlayer(firstPlayer);
        } else {
                beginTurnForPlayer(secondPlayer);
        }

        console.log(firstPlayer.startCards);
        console.log(secondPlayer.startCards);
});

function createCard(cardData, isNewCard) {
        // Создаем главный div для карты
        console.log(cardData);
        const cardDiv = document.createElement('div');
        cardDiv.className = "card";
        cardDiv.id = `${cardData.id}`;

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
        document.getElementById('player1_cards').appendChild(cardDiv);

        activateDragAndDrop(".card");

        if (isNewCard) {
                setTimeout(() => {
                        cardDiv.classList.add('visible');
                }, 50);
        }
        // После небольшой паузы (например, 50 мс) добавляем класс visible, чтобы начать анимацию

}

function addThreePlayerCards(dataObject) {
        const container = document.getElementById('player1_cards');

        dataObject.startCards.forEach((card, index) => {
                // Здесь мы создаем задержку перед тем, как создать и показать карту
                setTimeout(() => {
                        createCard(card); // Создаем карту
                        const addedCard = container.lastChild; // Последний добавленный элемент

                        // Задержка перед добавлением класса visible
                        setTimeout(() => {
                                addedCard.classList.add('visible');
                        }, 100);
                }, index * 300); // Общая задержка учитывает индекс, поэтому первая карта будет сразу, вторая через 300ms, третья через 600ms и т.д.
        });
}

function createEnemyCard(appendToContainer = false) {
        // Создаем элемент div для карты
        const cardDiv = document.createElement('div');
        cardDiv.className = "enemies_unknown_card";

        // Создаем SVG для карты
        const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElem.setAttribute('width', '82');
        svgElem.setAttribute('height', '48');
        svgElem.setAttribute('viewBox', '0 0 82 48');

        // Создаем path для SVG
        const pathElem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElem.setAttribute('d', 'M72.25 37.6667L61.9375 23.5167M41 43.9167V29.3333M9.75 37.6667L20.0375 23.55M3.5 4.33333C18.5 37.6667 63.5 37.6667 78.5 4.33333');
        pathElem.setAttribute('stroke', '#90acca');
        pathElem.setAttribute('stroke-width', '7');
        pathElem.setAttribute('stroke-linecap', 'round');
        pathElem.setAttribute('stroke-linejoin', 'round');
        pathElem.setAttribute('fill', 'none');

        // Добавляем path в SVG
        svgElem.appendChild(pathElem);
        // Добавляем SVG в div карточки
        cardDiv.appendChild(svgElem);

        // Если передан параметр appendToContainer, добавляем карту в контейнер
        if (appendToContainer) {
                const container = document.getElementById('player2_cards');
                container.appendChild(cardDiv);

                // Добавляем анимацию появления
                setTimeout(() => {
                        cardDiv.classList.add('visible');
                }, 50);
        }

        return cardDiv;
}

function removeEnemyCard() {
        const container = document.getElementById('player2_cards');
        const firstCard = container.firstElementChild;

        if (firstCard) {
                firstCard.remove();
        }
}


function addThreeEnemyCards() {
        const container = document.getElementById('player2_cards');

        for (let i = 0; i < 3; i++) {
                const card = createEnemyCard();
                container.appendChild(card);

                // Добавляем анимацию через небольшой промежуток времени для каждой карты
                setTimeout(() => {
                        card.classList.add('visible');
                }, i * 300); // 300ms между каждой анимацией
        }
}

function displayEnemyCard(cardData) {
        const card = cardData.card;
        const cardDiv = document.createElement('div');
        cardDiv.className = "card";
        cardDiv.classList.add('enemy-card');
        cardDiv.id = `${card.id}`;

        // Создаем div для стоимости маны
        const manaCostDiv = document.createElement('div');
        manaCostDiv.className = "mana_cost";
        manaCostDiv.textContent = card.mana; // Предполагая, что у вас есть поле mana_cost в данных карты
        cardDiv.appendChild(manaCostDiv);

        // Создаем p для имени карты
        const cardNameP = document.createElement('p');
        cardNameP.className = "cardname";
        cardNameP.textContent = card.name; // Предполагая, что у вас есть поле name в данных карты
        cardDiv.appendChild(cardNameP);

        // Создаем img для изображения карты
        const cardImg = document.createElement('img');
        cardImg.className = "card_img";
        cardImg.src = card.picture_path; // Предполагая, что у вас есть поле image_url в данных карты
        cardImg.alt = card.name;
        cardDiv.appendChild(cardImg);

        // Создаем div для атаки
        const attackDiv = document.createElement('div');
        attackDiv.className = "attack";
        attackDiv.textContent = card.damage; // Предполагая, что у вас есть поле attack в данных карты
        cardDiv.appendChild(attackDiv);

        // Создаем div для здоровья
        const hpDiv = document.createElement('div');
        hpDiv.className = "hp";
        hpDiv.textContent = card.hp; // Предполагая, что у вас есть поле hp в данных карты
        cardDiv.appendChild(hpDiv);

        const targetSlot = document.getElementById(`slot-${cardData.slotId}`);
        if (targetSlot) {
                targetSlot.appendChild(cardDiv);
        } else {
                console.error(`Slot with ID slot-${cardData.slotId} not found`);
        }
}


function createDivWithStyles({ container, className, idPrefix, topOffset }) {
        const gridWidth = 150,
                gridHeight = 250,
                gridColumns = 8,
                gap = 20,  // gap между дивами
                totalDivsWidth = (gridColumns * gridWidth) + (gridColumns - 1) * gap,
                leftOffset = (container.width() - totalDivsWidth) / 2;

        if ($("." + className).length === 0) {
                for (let i = 0; i < gridColumns; i++) {
                        const x = i * (gridWidth + gap) + leftOffset; // замените 17 на gap
                        $("<div/>").css({
                                position: "absolute",
                                // border: "1px solid #454545",
                                width: gridWidth - 1,
                                height: gridHeight - 1,
                                top: topOffset,
                                left: x,
                                zIndex: -9999
                        })
                                .attr('id', idPrefix + '-' + i)
                                .prependTo(container)
                                .addClass(className);
                }
        }

}

function createCardSlots() {
        createDivWithStyles({
                container: $("#player2-area"),
                className: "slot",
                idPrefix: "slot",
                topOffset: 5
        });
}

function activateDragAndDrop(cardElement) {
        createDivWithStyles({
                container: $("#player1-area"),
                className: "dropzone",
                idPrefix: "",
                topOffset: 5
        });
        if ($(".dropzone").length === 0) {
                for (i = 0; i < gridColumns; i++) {
                        x = i * (gridWidth + 10) + leftOffset; // Учитываем отступ
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
                        console.log("Card was dropped into a dropzone");

                        const cardId = ui.draggable.attr("id");
                        const dropZonePosition = $(this).index('.dropzone');
                        socket.emit("placeCard", { slotId: dropZonePosition, cardId: cardId });

                        // Просто добавьте элемент в dropzone
                        $(this).append(ui.draggable);

                        // Примените необходимые стили к перемещенной карточке
                        ui.draggable.css({
                                "cursor": "pointer",
                                "left": "",
                                "top": "",
                                "transform": "none",
                        });

                        // Убедитесь, что карточка снова становится перетаскиваемой
                        makeCardDraggable(ui.draggable);
                }
        });

}

function makeCardDraggable(card) {
        $(card).draggable({
                revert: "invalid",
                start: function (event, ui) {
                        console.log("Drag started");
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
}

$(document).ready(function () {
        $(".enemycard").draggable("disable");
})

$(document).ready(function () {
        $(".avatar_container").on('mousedown', function () {
                // Убедитесь, что класс animate удален перед добавлением, 
                // чтобы можно было повторно запустить анимацию
                $(this).removeClass("animate").addClass("animate");
        });

        // Удалить класс animate по завершении анимации, чтобы можно было запустить анимацию снова
        $(".avatar_container").on('animationend', function () {
                $(this).removeClass("animate");
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

function minusCountCards() {
        const numberDiv = document.getElementById('numberCards');
        let currentValue = parseInt(numberDiv.textContent, 10);
    
        if (!isNaN(currentValue)) {
            numberDiv.textContent = currentValue - 1;
        }
}