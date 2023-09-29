document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var data = {
        login: username,
        password: password
    };

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
            if (response.redirected)
                document.location = response.url;
            else
                return response.text();
        }).then(data => {
        if (data === 'Invalid login or password')
            alert('Неправильный логин или пароль');
        else
            console.error('Произошла ошибка:', data);
    }).catch(error => {
        // Обработка ошибки, которая могла возникнуть при отправке запроса
        console.error('Произошла ошибка при отправке запроса: ' + error.message);
    });
});