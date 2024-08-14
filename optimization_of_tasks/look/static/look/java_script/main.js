const roomName = JSON.parse(document.getElementById('user-id').textContent); // Кто дал задачу
//Фильтрация для создания задач на определенного usera
var userId_for_user_list;
var mainMenuButton = document.querySelector('.main-menu-button');
var mainMenuContainer = document.querySelector('.main_menu_container');
var tablinks = document.querySelectorAll('.tablinks');


function searchUsers() {
   // Получаем значение из поля ввода
   var input = document.getElementById('searchInput').value.toUpperCase();
   var users = document.getElementsByClassName('FIO_users_main');

   // Перебираем всех пользователей и скрываем тех, у кого нет совпадений
   for (var i = 0; i < users.length; i++) {
       var username = users[i].textContent.toUpperCase();
       if (username.indexOf(input) > -1) {
           users[i].parentNode.style.display = '';
       } else {
           users[i].parentNode.style.display = 'none';
       }
   }
}


function toggleMenu() {
  mainMenuContainer.classList.toggle('active');
}

// Закрытие меню при клике на кнопку mainMenuButton
mainMenuButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Останавливаем всплытие события
});

// Закрытие меню при клике на ссылку вкладки
tablinks.forEach(tablink => {
  tablink.addEventListener('click', () => {
    mainMenuContainer.classList.remove('active');
  });
});

// Закрытие меню при клике вне области меню
document.addEventListener('click', (event) => {
  if (!mainMenuContainer.contains(event.target) && event.target !== mainMenuButton) {
    mainMenuContainer.classList.remove('active');
  }
});


//Ниже мы получаем id выбранной задачи которую добавили через вебсокет
document.getElementById('task_websocket').addEventListener('click', function(e) {
    if (e.target && e.target.matches('.task-link')) {
        const taskID = e.target.querySelector('.task_ID').textContent;
        handleTaskClick(taskID);
    }
    else if (e.target && e.target.closest('.task-link')) {
        const taskID = e.target.closest('.task-link').querySelector('.task_ID').textContent;
        handleTaskClick(taskID);
    }
});


let id_task_for_message //ОСНОВНАЯ ПЕРЕМЕННА КОТОРАЯ ПЕРЕДАЕТ ID ЗАДАЧИ НАШЕМ СООБЩЕНИЮ WEBSCOKET


//ПОЛУЧЕНИЕ ID Задачи, которая была создана через websocket
let taskId_websocket
function handleTaskClick(taskId_websocket) {
    console.log(id_task_for_message)
    id_task_for_message = taskId_websocket
    task_id_from_websocket = taskId_websocket
    document.getElementById('main_message_block_and_create_message-block').style.display = "block";

    $.ajax({
        url: '/get_messages/',
        type: 'GET',
        data: {
            task_id_not_ws: task_id_from_websocket,
        },
        success: function (response) {
            // var result = response.task_full; //id задачи, которую сохранини в ajax запросе
            // console.log("AJAX " + result); // Проверяем значение result
            var task_id_full = response.task_id_full; //Номер
            var status_task_full = response.status_task_full; //Статус задачи
            var task_full = response.task_full; //Описание
            var user_id_gave_the_task_full = response.user_id_gave_the_task_full; //Кто выдал
            var created_task_full = response.created_task_full; //Время создания
            var end_the_last_number_full = response.end_the_last_number_full; //До какого нужно выполнить
            var end_task_time_new_full = response.end_task_time_new_full; //Завершена во сколько или не завершена

            //Дата и время создания задачи
            var dateTime_created_task_full = new Date(created_task_full);
            // Форматирование даты и времени в нужный вид
            var formattedDate_created_task_full = dateTime_created_task_full.toLocaleDateString(); // Получение форматированной даты
            var formattedTime_created_task_full = dateTime_created_task_full.toLocaleTimeString(); // Получение форматированного времени

            //Дата и время, когда нужно завершить задачу
            var dateTime_end_the_last_number_full = new Date(end_the_last_number_full);
            // Форматирование даты и времени в нужный вид
            var formattedDate_end_the_last_number_full = dateTime_end_the_last_number_full.toLocaleDateString(); // Получение форматированной даты
            var formattedTime_end_the_last_number_full = dateTime_end_the_last_number_full.toLocaleTimeString(); // Получение форматированного времени

            //Дата и время завершения задачи
            var dateTime_end_task_time_new_full = new Date(end_task_time_new_full);
            // Форматирование даты и времени в нужный вид
            var formattedDate_end_task_time_new_full = dateTime_end_task_time_new_full.toLocaleDateString(); // Получение форматированной даты
            var formattedTime_end_task_time_new_full = dateTime_end_task_time_new_full.toLocaleTimeString(); // Получение форматированного времени


            $('.task_id_full').html(task_id_full);
            $('.status_task_full').html(status_task_full);
            $('.task_full').html(task_full);
            $('.user_id_gave_the_task_full').html(user_id_gave_the_task_full);
            $('.created_task_full').html(formattedDate_created_task_full + " " + formattedTime_created_task_full);
            $('.end_the_last_number_full').html(formattedDate_end_the_last_number_full + " " + formattedTime_end_the_last_number_full);

            if (end_task_time_new_full !== null) {
                $('.description_end_task_time_new_full').html("Завершено: ");
                $('.end_task_time_new_full').html(formattedDate_end_task_time_new_full + " " + formattedTime_end_task_time_new_full);
            } else {
                $('.end_task_time_new_full').html("ИЗМЕНИТЬ НА ДАТУ"); // Если значение null, добавляем пустую строку
            }

            var search_message_for_task = JSON.parse(response.search_message_for_task);
            displayMessages(search_message_for_task);  // Вызов функции для отображения сообщений
        }
    });
}

//_____________________МОДАЛЬНОЕ ОКНО С ОПИСАНИЕМ ЗАДАЧИ И СООБЩЕНИЯМИ________________________________
// Получить элемент main_message_block_and_create_message-block
const mainMessageBlock = document.getElementById('main_message_block_and_create_message-block');

// Проверить ширину экрана
if (window.innerWidth <= 769) {
  // Создать модальное окно
  const modal = document.createElement('div');
  modal.classList.add('modal');

  // Создать содержимое модального окна
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContent.appendChild(mainMessageBlock);

  // Добавить содержимое в модальное окно
  modal.appendChild(modalContent);

  // Добавить модальное окно в документ
  document.body.appendChild(modal);

  // Скрыть элемент вне модального окна
  mainMessageBlock.style.display = 'none';
}

const modal = document.querySelector('.modal');

function showModal() {
  if (window.innerWidth <= 769) {
    modal.style.display = 'block';
    document.getElementById('main_message_block_and_create_message-block').style.display = "block";
  } else {
    mainMessageBlock.style.display = 'block';

  }
}

// Функция для скрытия модального окна
function hideModal() {
  if (window.innerWidth <= 769) {
    modal.style.display = 'none';

  } else {
    mainMessageBlock.style.display = 'none';
  }
}

// Вызов функции показа модального окна при нажатии на кнопку
document.getElementById('my-button').addEventListener('click', showModal);

// Вызов функции скрытия модального окна при клике вне модального окна
modal.addEventListener('click', hideModal);
//_________________________________________________________________


//ПОЛУЧЕНИЕ ID Задачи, которая была создана давно и отображается не через webscoket
function handleRowClick(taskId) {
    id_task_for_message = taskId
    task_id_not_ws = taskId;
    console.log("Выбранная задача " + task_id_not_ws);
    showModal();  //ПОКАЗАТЬ ИЛИ НЕТ МОДАЛЬНОЕ ОКНО
    $.ajax({
        url: '/get_messages/',
        type: 'GET',
        data: {
            task_id_not_ws: task_id_not_ws,
        },
        success: function (response) {
            var task_id_full = response.task_id_full; //Номер
            var status_task_full = response.status_task_full; //Статус задачи
            var task_full = response.task_full; //Описание
            var user_id_gave_the_task_full = response.user_id_gave_the_task_full; //Кто выдал
            var created_task_full = response.created_task_full; //Время создания
            var end_the_last_number_full = response.end_the_last_number_full; //До какого нужно выполнить
            var end_task_time_new_full = response.end_task_time_new_full; //Завершена во сколько или не завершена

            //Дата и время создания задачи
            var dateTime_created_task_full = new Date(created_task_full);
            // Форматирование даты и времени в нужный вид
            var formattedDate_created_task_full = dateTime_created_task_full.toLocaleDateString(); // Получение форматированной даты
            var formattedTime_created_task_full = dateTime_created_task_full.toLocaleTimeString(); // Получение форматированного времени

            //Дата и время, когда нужно завершить задачу
            var dateTime_end_the_last_number_full = new Date(end_the_last_number_full);
            // Форматирование даты и времени в нужный вид
            var formattedDate_end_the_last_number_full = dateTime_end_the_last_number_full.toLocaleDateString(); // Получение форматированной даты
            var formattedTime_end_the_last_number_full = dateTime_end_the_last_number_full.toLocaleTimeString(); // Получение форматированного времени

            //Дата и время завершения задачи
            var dateTime_end_task_time_new_full = new Date(end_task_time_new_full);
            // Форматирование даты и времени в нужный вид
            var formattedDate_end_task_time_new_full = dateTime_end_task_time_new_full.toLocaleDateString(); // Получение форматированной даты
            var formattedTime_end_task_time_new_full = dateTime_end_task_time_new_full.toLocaleTimeString(); // Получение форматированного времени


            $('.task_id_full').html(task_id_full);
            $('.status_task_full').html(status_task_full);
            $('.task_full').html(task_full);
            $('.user_id_gave_the_task_full').html(user_id_gave_the_task_full);
            $('.created_task_full').html(formattedDate_created_task_full + " " + formattedTime_created_task_full);
            $('.end_the_last_number_full').html(formattedDate_end_the_last_number_full + " " + formattedTime_end_the_last_number_full);

            if (end_task_time_new_full !== null) {
                $('.description_end_task_time_new_full').html("Завершено: ");
                $('.end_task_time_new_full').html(formattedDate_end_task_time_new_full + " " + formattedTime_end_task_time_new_full);
            } else {
                $('.end_task_time_new_full').html("ИЗМЕНИТЬ НА ДАТУ"); // Если значение null, добавляем пустую строку
            }

            var search_message_for_task = response.search_message_for_task;
            displayMessages(search_message_for_task);  // Вызов функции для отображения сообщений
            console.log(search_message_for_task)

        }
    });
}

// Функция для отображения сообщений в HTML при нажатии на задачу
function displayMessages(messages) {
    console.log(messages)
    var messageContainer = document.getElementById('message_container');  // Получаем контейнер для сообщений
    messageContainer.innerHTML = '';
    messages.forEach(function(message) {
        var message_main_a = document.createElement('a');
        message_main_a.className = 'main_a_message_for_task';
        message_main_a.setAttribute('onclick', 'handleRowClickMessage(\'' + message.pk + '\')');

        var messageDiv = document.createElement('div');  // Создаем новый элемент div для сообщения
        messageDiv.className = 'message';  // Добавляем класс "message"
        messageDiv.textContent = message.fields.message;  // Устанавливаем текст сообщения

        var messageDivFIO = document.createElement('div');  // Создаем новый элемент div для сообщения
        messageDivFIO.className = 'messageDivFIO';  // Добавляем класс "message"
        messageDivFIO.textContent = message.fields.user_id_gave_the_message;  // Устанавливаем текст сообщения


        var messageDiv_created_message = document.createElement('div');
        messageDiv_created_message.className = 'time_created_message';
        var taskCreatedDate = new Date(message.fields.created_message);
        var formattedDate = taskCreatedDate.getFullYear() + '.' +
                        ('0' + (taskCreatedDate.getMonth() + 1)).slice(-2) + '.' +
                        ('0' + taskCreatedDate.getDate()).slice(-2) + ' ' +
                        ('0' + taskCreatedDate.getHours()).slice(-2) + ':' +
                        ('0' + taskCreatedDate.getMinutes()).slice(-2);
        messageDiv_created_message.textContent = formattedDate;

        message_main_a.appendChild(messageDivFIO);
        message_main_a.appendChild(messageDiv);  // Добавляем сообщение в контейнер
        message_main_a.appendChild(messageDiv_created_message); //Добавляем время создания сообщения
        messageContainer.appendChild(message_main_a);
    });
}
//КОД ТУТ ОКРАШИВАЕТ СТРОКУ С ВЫБРАННЫМ ПОЛЬЗОВАТЕЛЕМ И ПОМЕЩАЕТ id в переменную userId_for_user_list ДЛЯ ВЫДАЧИ ЗАДАЧИ
function handleRowClickUser(userId) {
    userId_for_user_list = userId;
    console.log(userId_for_user_list);

    var messageElements = document.querySelectorAll('.a-message_in_user_list');
    messageElements.forEach(function(element) {
        element.innerHTML = ''; // Очищаем содержимое элемента
    });
    TasksForUser(userId_for_user_list);

}
document.addEventListener("DOMContentLoaded", function() {
var userRows = document.querySelectorAll("#Users .main_container_list_users .FIO_users_main");

userRows.forEach(row => {
    row.addEventListener("click", function() {
        // Удаляем класс у предыдущей выбранной строки
        var selectedRows = document.querySelectorAll("#Users .main_container_list_users .selected_row");
        selectedRows.forEach(selectedRow => {
            selectedRow.classList.remove("selected_row");
        });

        this.classList.add("selected_row");
        var userId = this.getAttribute("data-user-id"); // Получаем атрибут data-user-id для идентификации пользователя
        // Теперь userId содержит ID выбранного пользователя, который можно использовать далее в вашем приложении
        });
    });
});

// Открытие и закрытие вкладок из левого меню
function openCity(event, cityName) {
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";}

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");}
    if (cityName === 'Tasks_for_me') {
        document.getElementById('Tasks_for_me').style.display = 'block';}
        document.getElementById('create_task_modal').style.display = 'none';

    document.getElementById(cityName).style.display = "block";
    event.currentTarget.className += " active";
}

function openCityMain(event, cityName) {
    if (cityName === 'Task_me') {
            // Скрываем окно Tasks_for_me
            document.getElementById('Tasks_for_me').style.display = 'none';
            // Показываем окно создания задачи
            document.getElementById('create_task_modal').style.display = 'block';
            document.getElementById('main_message_block_and_create_message-block').style.display = "none";
        }
        document.getElementById(cityName).style.display = "block";
        event.currentTarget.className += " active"; //evt
    }

// ФУНКЦИЯ ЗАМЕНЫ СТАТУСОВ ДЛЯ ЗАДАЧИ В БЛОКЕ СООБЩЕНИЙ И ПОЛНОГО ОПИСАНИЯ ЗАДАЧИ
// Далее функция должна делать ajax запрос для изменения статуса задачи
function setStatus(element) {
        var text = element.textContent;
        var statusTaskFull = document.querySelector('.status_task_full');
        statusTaskFull.textContent = text;
    }

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
