//Добавление через Websocket <a> и <div> для задач
const user = JSON.parse(document.getElementById('user').textContent);
const give_task_id = userId_for_user_list; //Кому дали задачу

const chatSocket = new WebSocket(
'ws://' + window.location.host + '/ws/main_page_with_tasks/' + 'MAIN' + '/');

chatSocket.onmessage = function (e) {
const data = JSON.parse(e.data);
const taskAddSocket = document.getElementById('task_websocket');

console.log(userId_for_user_list + " ===" + data.give_task_id_id);
//Блок добавления задачи у того, кому дали её
if (roomName == data.give_task_id_id) {
    const taskLink = document.createElement('a');
    taskLink.className = 'task-link'

    const task_ID = document.createElement('div');
    task_ID.className = 'task_ID';
    task_ID.textContent = data.result;
    // Добавляем задачу внутрь элемента task_add_socket
    taskLink.appendChild(task_ID);
    // Создаем новый элемент для задачи
    const newTask = document.createElement('div');
    newTask.className = 'task_WEBSCOKET';
    newTask.textContent = data.task;
    // Добавляем задачу внутрь элемента task_add_sock
    taskLink.appendChild(newTask);

    // Создаем новый элемент со статусом задачи
    const status_task = document.createElement('div');
    status_task.className = 'status_task_WEBSCOKET';
    status_task.textContent = data.status_task;
    // Добавляем задачу внутрь элемента task_add_socket
    taskLink.appendChild(status_task);

    taskAddSocket.appendChild(taskLink);

    //Добавляем через webscoket задачу которую мы добавили если открыто меню задач того, кому добавили (в правом маленьком меню)
    if (userId_for_user_list == data.give_task_id_id) {
        var TaskContainerInAddTask= document.getElementById('tasks_in_user_list');  // Получаем контейнер для задач

        var task_main_a = document.createElement('a');
        task_main_a.className = 'a-tasks_in_user_list';
        task_main_a.setAttribute('onclick', 'handleRowClickTaskMain(\'' + data.result + '\')');

        var taskDiv = document.createElement('div');
        taskDiv.className = 'task_tasks_in_user_list';
        taskDiv.textContent = data.task;

        var taskCreatedDiv = document.createElement('div');  // Создаем новый элемент div для времени создания задачи
        taskCreatedDiv.className = 'created_task-tasks_in_user_list';
        taskCreatedDiv.textContent = data.datetime_start;  // Устанавливаем текст времени создания задачи

        task_main_a.appendChild(taskDiv);
        task_main_a.appendChild(taskCreatedDiv);
        TaskContainerInAddTask.appendChild(task_main_a);
    }
}

//Блок добавления задачи у того, кто её дал
else if (userId_for_user_list == data.give_task_id_id) {
    var TaskContainerInAddTask= document.getElementById('tasks_in_user_list');  // Получаем контейнер для задач

    var task_main_a = document.createElement('a');
    task_main_a.className = 'a-tasks_in_user_list';
    task_main_a.setAttribute('onclick', 'handleRowClickTaskMain(\'' + data.result + '\')');

    var taskDiv = document.createElement('div');
    taskDiv.className = 'task_tasks_in_user_list';
    taskDiv.textContent = data.task;

    var taskCreatedDiv = document.createElement('div');  // Создаем новый элемент div для времени создания задачи
    taskCreatedDiv.className = 'created_task-tasks_in_user_list';
    taskCreatedDiv.textContent = data.datetime_start;  // Устанавливаем текст времени создания задачи

    task_main_a.appendChild(taskDiv);
    task_main_a.appendChild(taskCreatedDiv);
    TaskContainerInAddTask.appendChild(task_main_a);
}

};
const messageInputDom = document.querySelector('#chat-task-input');
const task = messageInputDom.value;
document.querySelector('#chat-task-input').focus();

document.querySelector('#chat-task-input').onkeyup = function (e) {
console.log('тут');
if (e.keyCode === 13) {  // enter, return
    document.querySelector('#chat-task-submit').click();
}
};
document.querySelector('#chat-task-submit').onclick = function (e) {
console.log('тут');
const user_id_gave_the_task = JSON.parse(document.getElementById('user-id-gave-the-task').textContent);
const messageInputDom = document.querySelector('#chat-task-input');
const task = messageInputDom.value;

console.log('тут');
const date1 = document.getElementById('datepicker1').value; //Дата начала
const date2 = document.getElementById('datepicker2').value;
const time1 = document.getElementById('timepicker1').value; //Время начала
const time2 = document.getElementById('timepicker2').value;

$.ajax({
    url: '/get_messages_for_task/',
    type: 'GET',
    data: {
        give_task_id: userId_for_user_list,
        task: task,
        user_id: roomName,
        datestart: date1,
        dateend: date2,
        timestart: time1,
        timeend: time2,
    },
    success: function (response) {
        var result = response.task_add_id; //id задачи, которую сохранини в ajax запросе
        var FIO_result = response.FIO_user; //Сокращенное фио того кто отправил задачу ( Иванов В.П. )


        // В этом месте переменная result уже имеет значение из AJAX-ответа
        chatSocket.send(JSON.stringify({
            'result': result,
            'task': task,
            'give_task_id': userId_for_user_list,
            'user_id_gave_the_task': FIO_result,
            'user_id': roomName,
            'datestart': date1,
            'timestart': time1,
        }));
    }
});
messageInputDom.value = '';
};
