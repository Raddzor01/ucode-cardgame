document.getElementById("singupForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (username === '') {
        alert('Пожалуйста, введите логин.');
        return; // Останавливаем отправку формы
    }

    if (password === '') {
        alert('Пожалуйста, введите пароль.');
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
        name: username,
        email: email,
        password: password
    };

    // Отправляем данные на сервер с использованием AJAX-запроса
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.redirected)
            document.location = response.url;
        else
            return response.text();
    }).then(data => {
            if(data === 'User exists')
                alert("User with this username already exists!");
            if(data === 'Email in use')
                alert("User with this email already exists!");
    }).catch(error => {
            // Обработка ошибки, которая могла возникнуть при отправке запроса
            console.error('Произошла ошибка при отправке запроса: ' + error.message);
        });
});
