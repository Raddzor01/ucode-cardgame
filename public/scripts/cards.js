
fetch('/all-cards', { method: "POST" })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Полученные данные:', data);

        // сюда вывод короче
    })
    .catch(error => {
        console.error('Произошла ошибка при запросе:', error);
    });