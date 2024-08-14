const search_tasks = JSON.parse(document.getElementById('search-tasks').textContent); // Все задачи
const users_list = JSON.parse(document.getElementById('search-users').textContent); // Все пользователи компании (сделать ограничение на компанию)
const searchInput = document.getElementById('searchInputMain');
const searchResults = document.getElementById('search-results');
const searchResultsContainer = document.querySelector('.search-results-container');


//Функция нажатия на окно поиска
searchInput.addEventListener('keyup', () => {
  const searchTerm = searchInput.value.trim().toLowerCase(); // Приводим строку поиска к нижнему регистру и удаляем начальные и конечные пробелы

  // Поиск совпадений в задачах
  const filteredTasks = search_tasks.filter(task => {
    const taskText = task.task.toLowerCase(); // Приводим текст задачи к нижнему регистру
    return taskText.includes(searchTerm); // Проверяем, содержит ли текст задачи введенную строку поиска
  }).slice(0, 2); // Ограничение до первых двух записей

  // Поиск совпадений в пользователях
  const filteredUsers = users_list.filter(user => {
    const userFullName = `${user.username} ${user.lastname} ${user.middlename}`.toLowerCase(); // Получаем полное имя пользователя и приводим к нижнему регистру
    return userFullName.includes(searchTerm); // Проверяем, содержит ли полное имя пользователя введенную строку поиска
  }).slice(0, 2); // Ограничение до первых двух записей

  // Очистка результатов поиска
  searchResults.innerHTML = '';

  //Добавляем надпись "Задачи"
  const info_search = document.createElement('div');
  info_search.classList.add('info_search');
  info_search.textContent = 'Задачи'
  searchResults.appendChild(info_search);
  // Добавление результатов поиска
  filteredTasks.forEach(task => {
    //Добавление задач в окно поиска
    const search_main_a = document.createElement('a');
    search_main_a.className = 'search_main_a';
    search_main_a.setAttribute('onclick', 'handleRowClickSearch(\'' + task.id + '\')');

    const resultItem = document.createElement('div');
    resultItem.classList.add('search-result');
    resultItem.textContent = task.task;

    const button_move = document.createElement('button');
    button_move.classList.add('button_move_task');
    button_move.textContent = 'Перейти к источнику'

    search_main_a.appendChild(resultItem);
    search_main_a.appendChild(button_move);
    searchResults.appendChild(search_main_a);
  });
  const info_search_users = document.createElement('div');
  info_search_users.classList.add('info_search');
  info_search_users.textContent = 'Пользователи'
  searchResults.appendChild(info_search_users);

  //Добавление пользователей в окно поиска
  filteredUsers.forEach(user => {
    const search_main_a = document.createElement('a');
    search_main_a.className = 'search_main_a';
    search_main_a.setAttribute('onclick', 'handleRowClickSearch(\'' + user.id + '\')');

    const resultItem = document.createElement('div');
    resultItem.classList.add('search-result');
    resultItem.textContent = `${user.username} ${user.lastname} ${user.middlename}`;

    const button_move = document.createElement('button');
    button_move.classList.add('button_move_users');
    button_move.textContent = 'Перейти к источнику'

    search_main_a.appendChild(resultItem);
    search_main_a.appendChild(button_move);
    searchResults.appendChild(search_main_a);
  });

  // Отображение результатов поиска
  if (filteredTasks.length > 0 || filteredUsers.length > 0) {
    searchResultsContainer.style.display = 'flex';
  } else {
    searchResultsContainer.style.display = 'none';
  }
});

// Обработчик клика вне блока с searchResultsContainer (При нажатии вне него, он становится none)
document.addEventListener('click', (event) => {
  const isClickInsideContainer = searchResultsContainer.contains(event.target);
  // Проверяем, был ли клик внутри контейнера
  if (!isClickInsideContainer) {
    searchResultsContainer.style.display = 'none'; // Скрываем контейнер
  }
});

