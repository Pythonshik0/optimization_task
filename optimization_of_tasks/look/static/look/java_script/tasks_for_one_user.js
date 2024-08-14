function TasksForUser(id_user) {
    $.ajax({
        url: '/tasks_for_user/',
        type: 'GET',
        data: {
            id_user: id_user,
        },
        success: function(response) {
            var tasks_full = response.task_list_for_user; // Получаем список задач

            var TaskContainer = document.getElementById('tasks_in_user_list');  // Получаем контейнер для задач
            TaskContainer.innerHTML = '';

            for (var i = 0; i < tasks_full.length; i++) {
                var task = tasks_full[i];

                var task_main_a = document.createElement('a');
                task_main_a.className = 'a-tasks_in_user_list';
                task_main_a.setAttribute('onclick', 'handleRowClickTaskMain(\'' + task.id + '\')');

                var taskDiv = document.createElement('div');
                taskDiv.className = 'task_tasks_in_user_list';
                taskDiv.textContent = task.task;


                var taskCreatedDiv = document.createElement('div');
                taskCreatedDiv.className = 'created_task-tasks_in_user_list';
                var taskCreatedDate = new Date(task.created_task);
                // Форматирование даты в нужный вид
                var formattedDate = taskCreatedDate.getFullYear() + '.' +
                                    ('0' + (taskCreatedDate.getMonth() + 1)).slice(-2) + '.' +
                                    ('0' + taskCreatedDate.getDate()).slice(-2) + ' ' +
                                    ('0' + taskCreatedDate.getHours()).slice(-2) + ':' +
                                    ('0' + taskCreatedDate.getMinutes()).slice(-2);
                taskCreatedDiv.textContent = formattedDate;

                task_main_a.appendChild(taskDiv);
                task_main_a.appendChild(taskCreatedDiv);
                TaskContainer.appendChild(task_main_a);
            }
        },
    });
}

function handleRowClickTaskMain(taskId_One) {
    task_id_for_one_user = taskId_One
    console.log(task_id_for_one_user)

    $.ajax({
        url: '/info_task_for_user/',
        type: 'GET',
        data: {
            id: task_id_for_one_user,
        },
        success: function(response) {
            var tasks_full = JSON.parse(response.info_task)[0].fields; // Получаем данные о задаче
            var user = response.user_FIO;

            var TaskContainerDec = document.getElementById('tasks_full_dec'); // Получаем контейнер для задачи
            TaskContainerDec.innerHTML = '';

            var task_main_div = document.createElement('div');
            task_main_div.className = 'dec_main_task_container';

            var TaskDiv = document.createElement('div');
            TaskDiv.className = 'task';
            TaskDiv.textContent = tasks_full.task;

            var TaskDivTimeStart = document.createElement('div');
            TaskDivTimeStart.className = 'time_created_task';
            TaskDivTimeStart.textContent = tasks_full.created_task;

            var TaskFIODiv = document.createElement('div');
            TaskFIODiv.className = 'FIO_issue_task';
            TaskFIODiv.textContent = user;

            //end_the_last_number
            var TaskFIODivEndLast = document.createElement('div');
            TaskFIODivEndLast.className = 'time_end_the_last_number';
            TaskFIODivEndLast.textContent = tasks_full.end_the_last_number;

            //status_task
            var TaskStatus = document.createElement('div');
            TaskStatus.className = 'time_end_the_last_number';
            TaskStatus.textContent = tasks_full.status_task;

            if (tasks_full.end_task_time_new == null) {
                var TaskEndFinal = document.createElement('div');
                TaskEndFinal.className = 'time_end_task_time_new';
                TaskEndFinal.textContent = 'time final'; //tasks_full.end_task_time_new
                task_main_div.appendChild(TaskEndFinal);
            };

            task_main_div.appendChild(TaskFIODivEndLast);
            task_main_div.appendChild(TaskStatus);
            task_main_div.appendChild(TaskDivTimeStart);
            task_main_div.appendChild(TaskFIODiv);
            task_main_div.appendChild(TaskDiv);
            TaskContainerDec.appendChild(task_main_div);

            // Список сообщений для нашей задачи на которую мы нажимаем
            var MessContainer = document.getElementById('message_container_web'); // Получаем контейнер для сообщений
            MessContainer.innerHTML = '';
            var list_mess = response.list_mess;
            console.log(list_mess)
            for (const value of list_mess) {
                var message_main_a = document.createElement('a');
                message_main_a.className = 'messages_for_task_container_a';
                message_main_a.setAttribute('onclick', 'handleRowClickMessage(\'' + value.pk.toString() + '\')');

                var MessageDiv = document.createElement('div');
                MessageDiv.className = 'message_description';
                MessageDiv.textContent = value.fields.message;

                var MessageDivFIO = document.createElement('div');
                MessageDivFIO.className = 'message_description_user_id_gave_the_message';
                MessageDivFIO.textContent = value.fields.user_id_gave_the_message;

                //created_message
                var MessageDivTime = document.createElement('div');
                MessageDivTime.className = 'message_description_time';
                var taskCreatedDate = new Date(value.fields.created_message);
                var formattedDate = taskCreatedDate.getFullYear() + '.' +
                                ('0' + (taskCreatedDate.getMonth() + 1)).slice(-2) + '.' +
                                ('0' + taskCreatedDate.getDate()).slice(-2) + ' ' +
                                ('0' + taskCreatedDate.getHours()).slice(-2) + ':' +
                                ('0' + taskCreatedDate.getMinutes()).slice(-2);
                MessageDivTime.textContent = formattedDate;

                message_main_a.appendChild(MessageDivFIO);
                message_main_a.appendChild(MessageDivTime);
                message_main_a.appendChild(MessageDiv);
                MessContainer.appendChild(message_main_a);
            }
        },
    });
}
