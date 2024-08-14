var task_id_for_one_user; //Id задачи на которую нажали у определенного пользователя при создании задач
var chatSocketm;
var task_id_main; //ПОМЕНЯТЬ НА ЗНАЧЕНИЕ ПРИ НАЖАТИИ НА ЗАДАЧУ usera
var FIO_message;

document.getElementById('chat-message-submit').addEventListener('click', function(e) {
    task_id_main = id_task_for_message; //ВМЕСТО id_task_for_message Должа быть переменная задачи на которую мы нажали, во вкладе создания задачи
    var messageInputDom = document.getElementById('chat-message-input');
    var message = messageInputDom.value.trim();

    if (message) {
        $.ajax({
            url: '/create_message/',
            type: 'GET',
            data: {
                message_AJAX: message,
                task_id_main_AJAX : task_id_main,
                user_AJAX: roomName
            },
            success: function (response) {
                FIO_message = response.user_AJAX;
                console.log(FIO_message);

                chatSocketm.send(JSON.stringify({
                    'message': message,
                    'task_id_main' : task_id_main,
                    'user': roomName,
                    'FIO_message': FIO_message,
                }));
                messageInputDom.value = '';
            }
        });
    }
});

document.getElementById('chat-message-input').addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        var message = messageInputDom.value.trim();
        if (message) {
            chatSocketm.send(JSON.stringify({
                'message': message,
                'task_id_main' : task_id_main,
                'user': roomName,
                'FIO_message': FIO_message,
            }));
            messageInputDom.value = '';
        }
    }
});

function connectWebSocket() {
    chatSocketm = new WebSocket('ws://' + window.location.host + '/ws/main_page_with_tasks/' + id_task_for_message + '/');
    chatSocketm.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log(data);
        if (id_task_for_message == data.task_id_main) {
            var messageAddSocket = document.getElementById('message_container');

            var message = document.createElement('div');
            message.className = 'message_websocket';
            message.textContent = data.message;

            const user_id_gave_the_task = JSON.parse(document.getElementById('user-id-gave-the-task').textContent);
            var user = document.createElement('div'); //Кто отправил сообщение
            user.className = 'user_create_message_now';
            user.textContent = data.FIO_message;

            var datetime_message = document.createElement('div');
            datetime_message.className = 'datetime_message_now';
            var taskCreatedDate = new Date(data.datetime_message);
            var formattedDate = taskCreatedDate.getFullYear() + '.' +
                                ('0' + (taskCreatedDate.getMonth() + 1)).slice(-2) + '.' +
                                ('0' + taskCreatedDate.getDate()).slice(-2) + ' ' +
                                ('0' + taskCreatedDate.getHours()).slice(-2) + ':' +
                                ('0' + taskCreatedDate.getMinutes()).slice(-2);
            datetime_message.textContent = formattedDate;

            messageAddSocket.appendChild(user);
            messageAddSocket.appendChild(datetime_message);
            messageAddSocket.appendChild(message);
        }
        else if (task_id_for_one_user == data.task_id_main) {
            var messageAddSocket_two = document.getElementById('message_container_web');
            // console.log(data.id)
            var message_main_a = document.createElement('a');
            message_main_a.className = 'a-message_in_user_list';
            message_main_a.setAttribute('onclick', 'handleRowClickMessage(\'' + 1 + '\')');

            var message_two = document.createElement('a');
            message_two.className = 'message_websocket_two';
            message_two.textContent = data.message;

            var user = document.createElement('div'); //Кто отправил сообщение
            user.className = 'user_create_message_now';
            user.textContent = data.FIO_message;
            console.log(FIO_message)

            var datetime_message = document.createElement('div');
            datetime_message.className = 'datetime_message_now';
            var taskCreatedDate = new Date(data.datetime_message);
            var formattedDate = taskCreatedDate.getFullYear() + '.' +
                            ('0' + (taskCreatedDate.getMonth() + 1)).slice(-2) + '.' +
                            ('0' + taskCreatedDate.getDate()).slice(-2) + ' ' +
                            ('0' + taskCreatedDate.getHours()).slice(-2) + ':' +
                            ('0' + taskCreatedDate.getMinutes()).slice(-2);
            datetime_message.textContent = formattedDate;

            message_main_a.appendChild(user);
            message_main_a.appendChild(datetime_message);
            message_main_a.appendChild(message_two);
            messageAddSocket_two.appendChild(message_main_a);
        }
    };
}
connectWebSocket();
//+++++++++++++++++++++++++++++Сообщения в правом меню++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
document.getElementById('chat-task-submit-message').addEventListener('click', function(e) {
    task_id_main = task_id_for_one_user; //ВМЕСТО id_task_for_message Должа быть переменная задачи на которую мы нажали, во вкладе создания задачи
    var messageInputDom = document.getElementById('chat-task-input-message');
    var message = messageInputDom.value.trim();

    if (message) {
        $.ajax({
            url: '/create_message/',
            type: 'GET',
            data: {
                message_AJAX: message,
                task_id_main_AJAX : task_id_main,
                user_AJAX: roomName
            },
            success: function (response) {
                FIO_message = response.user_AJAX;
                console.log(FIO_message);

                chatSocketm.send(JSON.stringify({
                    'message': message,
                    'task_id_main' : task_id_main,
                    'user': roomName,
                    'FIO_message': FIO_message,
                }));
                messageInputDom.value = '';
            }
        });
    }
});

