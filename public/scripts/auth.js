document.getElementById("singupForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirm = document.querySelector('#confirm').value;

    if (name === '') {
        alert('Пожалуйста, введите логин.');
        return; // Останавливаем отправку формы
    }

    if (password === '') {
        alert('Пожалуйста, введите пароль.');
        return;
    }

    if (confirm === '') {
        alert('Пожалуйста, подтвердите пароль.');
        return;
    }

    if (password !== confirm) {
        alert('Пароль и подтверждение пароля не совпадают.');
        return;
    }

    // Проверка на правильный формат email
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        alert('Пожалуйста, введите корректный email.');
        return;
    }

    // Создаем объект с данными, которые будут отправлены на сервер
    const data = {
        name: name,
        email: email,
        password: password
    };

    // Отправляем данные на сервер с использованием AJAX-запроса
    fetch('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                // Обработка успешного ответа от сервера
                // Например, можно перенаправить пользователя на другую страницу
                window.location.assign('/success');
            } else {
                // Обработка ошибки от сервера
                // Вывести сообщение об ошибке или выполнить другие действия
                console.error('Ошибка при отправке данных на сервер.');
            }
        })
        .catch(error => {
            // Обработка ошибки, которая могла возникнуть при отправке запроса
            console.error('Произошла ошибка при отправке запроса: ' + error.message);
        });
});

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var login = document.getElementById("login").value;
    var password = document.getElementById("password").value;

    var data = {
        login: login,
        password: password
    };

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.redirected) {
            document.location = response.url;
        } else {
            // Обработка ошибки от сервера
            // Вывести сообщение об ошибке или выполнить другие действия
            console.error('Ошибка при отправке данных на сервер.');
        }
    })
    .catch(error => {
        // Обработка ошибки, которая могла возникнуть при отправке запроса
        console.error('Произошла ошибка при отправке запроса: ' + error.message);
    });
});
