let socket = io();

socket.emit("getUserData", getCookie('token'));
socket.on("userData", (data) => {
    document.querySelector('.username').textContent = data.login;
    // document.querySelector('.card img').setAttribute('src', data.picture_path);
    document.querySelector('.wins').textContent = "Wins: " + data.wins;
    // document.querySelector('.loses').textContent = "Loses: " + data.loses;
});

const find_game_btn = document.getElementById('find_game');
const wrapper = document.querySelector('.wrapper');
const container = document.querySelector('.container');


// Сохраняем изначальное состояние .wrapper и .container
const initialWrapperChildren = Array.from(wrapper.children);
const initialContainerChildren = Array.from(container.children);

find_game_btn.addEventListener('click', () => {
    const loader = document.createElement('div');
    loader.classList.add('loader');

    const notification = document.createElement('p');
    notification.classList.add('notification');
    notification.textContent = 'Searching for an opponent...';

    const cancel_btn = document.createElement('button');
    cancel_btn.classList.add('cancel_btn');
    cancel_btn.textContent = 'Cancel';

    // Удаляем все дочерние элементы из .wrapper
    while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    }

    container.removeChild(find_game_btn);

    // Добавляем .loader, notification и cancel_btn как дочерние элементы к .wrapper
    wrapper.appendChild(loader);
    wrapper.appendChild(notification);
    container.appendChild(cancel_btn);

    // Обработчик события для кнопки "Cancel"
    cancel_btn.addEventListener('click', () => {
        // Удаляем все дочерние элементы из .wrapper
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        container.removeChild(cancel_btn);

        // Восстанавливаем изначальное состояние .wrapper и .container
        initialWrapperChildren.forEach((child) => {
            wrapper.appendChild(child);
        });

        initialContainerChildren.forEach((child) => {
            container.appendChild(child);
        });

        // Добавляем кнопку "Find Game!" обратно
        container.appendChild(find_game_btn);
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