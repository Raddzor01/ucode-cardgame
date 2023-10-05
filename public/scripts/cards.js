
fetch('/all-cards', { method: "POST" })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Полученные данные:', data);
        createCards(data);
        // сюда вывод короче
    })
    .catch(error => {
        console.error('Произошла ошибка при запросе:', error);
    });

function createCard(cardData) {
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
    document.getElementById('cards_wrapper').appendChild(cardDiv);

}

function createCards(cardsData) {
    cardsData.forEach(cardData => {
        createCard(cardData);
    });
}
$(document).ready(function () {
    $("#cards_wrapper").on("mousedown", ".card", function () {
        $(this).addClass("clicked");
    });

    $("#cards_wrapper").on("animationend", ".card", function () {
        $(this).removeClass("clicked");
    });
});

