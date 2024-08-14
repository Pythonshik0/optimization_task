from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import CustomUserCreationForm, CustomUser, CreateMessage
from django.contrib.auth.decorators import login_required
from .models import Task, Message, UpdateFileinMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.middleware.csrf import CsrfViewMiddleware
from django.core import serializers
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from django.core.exceptions import SuspiciousFileOperation
import os
from channels.layers import get_channel_layer
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.core.serializers import serialize
import json
from django.conf import settings
import glob


def home(request):
    return render(request, 'look/home.html')


def look_group(request):
    return render(request, 'look/viewing_a_group.html')


@login_required
def personal_account(request, lastname, name, middle):
    user_info = request.user
    user = CustomUser.objects.filter(id=user_info.id).first()
    user_id_photo = request.user.id

    # user_sql = CustomUser.objects.get(id=request.user.id)
    # user_sql.photo_user = 'false'
    # user_sql.save(update_fields=["photo_user"])

    if (user.photo_user != 'false') and (user.photo_user is not None): # /media/account_photo/user.png
        main_photo_user = f'/media/account_photo/{user_id_photo}{user.photo_user}'
    else:
        main_photo_user = ''

    context = {'user': user, 'user_id_photo': user_id_photo, 'main_photo_user': main_photo_user}
    return render(request, 'look/profile.html', context)


def upload_image(request):
    if request.method == 'POST':
        if 'image' in request.FILES:
            image_file = request.FILES['image']
            user = request.user.id
            if image_file:
                file_extension = os.path.splitext(image_file.name)[1]

                # Создание нового имени файла с именем пользователя и расширением
                file_name = f"{user}{file_extension}"
                # Создание пути для сохранения файла
                file_path = os.path.join('media/account_photo/', file_name)

                # Сохранение файла
                with open(file_path, 'wb+') as destination:
                    for chunk in image_file.chunks():
                        destination.write(chunk)

                user_sql = CustomUser.objects.get(id=request.user.id)
                user_sql.photo_user = file_extension
                user_sql.save(update_fields=["photo_user"])

            return JsonResponse({'image_file': image_file.name})
        else:
            return JsonResponse({'message': 'No image file in request'}, status=400)


@login_required
def main_page_with_tasks(request, user_id):
    user = request.user
    room_my_task = Task.objects.filter(user=user.id)
    users_list = CustomUser.objects.all()
    user_id_main = user.id
    user_id_gave_the_task = f'{user.lastname} {user.username} {user.middlename}'

    # Для создания поиска по задачам и user'ам
    search_tasks = Task.objects.all()

    tasks = list(search_tasks.values())
    users = list(users_list.values())
    # serialized_tasks = serialize('json', search_tasks)
    # search_tasks_serialized = json.loads(serialized_tasks)
    #
    # serialized_users = serialize('json', users_list)
    # search_serialized_users = json.loads(serialized_users)

    context = {'search_users': users, 'search_tasks': tasks, 'room_my_task': room_my_task, 'user': user, 'user_id_main': user_id_main, 'users_list': users_list, 'user_id_gave_the_task': user_id_gave_the_task}
    return render(request, 'look/main_page_with_tasks2.html', context)


@login_required
def get_messages_for_task(request):
    user_id_gave_the_task = request.GET.get('user_id') # Кто дал задачу
    user = request.GET.get('give_task_id')  # id того кому дали задачу
    date_start = request.GET.get('datestart')  # Дата начала
    date_end = request.GET.get('dateend')  # Дата окончания
    time_start = request.GET.get('timestart')  # Время начала
    time_end = request.GET.get('timeend')  # Время окончания
    full_user = CustomUser.objects.get(id=user) #Кому дали задачу
    full_user_id_gave_the_task = CustomUser.objects.get(id=user_id_gave_the_task) #Кто дал задачу

    FIO_user = f'{full_user_id_gave_the_task.lastname} {full_user_id_gave_the_task.username[0] if full_user_id_gave_the_task.username else ""}. {full_user_id_gave_the_task.middlename[0] if full_user_id_gave_the_task.middlename else ""}.'
    task = request.GET.get('task')

    created_task = f"{date_start} {time_start}"
    end_the_last_number = f"{date_end} {time_end}"
    status_task = 'Не получил'

    task_add = Task(
        task=task,
        created_task=created_task,
        end_the_last_number=end_the_last_number,
        status_task=status_task,
    )
    task_add.user_id_gave_the_task = full_user_id_gave_the_task # Заполняем кто дал задачу
    task_add.save()
    task_add.user.set([full_user]) # Заполняем значение кому дали задачу (тут отношение многих ко многим)
    task_add_id = task_add.id

    return JsonResponse({
        'task_add_id': task_add_id,
        'FIO_user': FIO_user,
    })


@login_required
# Создание сообщения в БД
def create_message(request):
    user_AJAX = request.GET.get('user_AJAX')
    user = CustomUser.objects.filter(id=user_AJAX).first()

    lastname = f"{user.lastname}" if user.lastname else ''
    username = f"{user.username[0]}." if user.username else ''
    middlename = f"{user.middlename[0]}." if user.middlename else ''

    FIO_user = f'{lastname} {username} {middlename}'

    # СДЕЛАТЬ СОХРАНЕНИЕ В БАЗУ ДАННЫХ СООБЩЕНИЯ!
    return JsonResponse({
        'user_AJAX': FIO_user,
    })


@login_required
# AJAX Получение задач для определенных пользователей
def tasks_for_user(request):
    id_user = request.GET.get('id_user') # id пользователя
    tasks = Task.objects.filter(user=id_user).values('id', 'task', 'created_task', 'end_task_time_new', 'status_task')
    return JsonResponse({'task_list_for_user': list(tasks)})


@login_required
# AJAX Получение полной информации об 1 задаче
def info_task_for_user(request):
    # Поиск данных для определенной задачи
    info_task = request.GET.get('id') # id пользователя
    task = Task.objects.filter(id=info_task).first()
    serialized_task = serialize('json', [task])

    user = CustomUser.objects.filter(id=task.user_id_gave_the_task.id).first()
    user_FIO = user.lastname + " " + (user.username if not None else "") + " " + (user.middlename if not None else "")

    # Поиск сообщений к этой задаче
    messages_list_for_task = Message.objects.filter(id_task=info_task)
    serialized_mess = serialize('json', messages_list_for_task)
    messages = json.loads(serialized_mess)

    # Чтобы изменить id на ФИО того, кто написал сообщение, используем код ниже
    for message in messages:
        user_id_gave_the_message = message['fields']['user_id_gave_the_message']
        user = CustomUser.objects.filter(id=user_id_gave_the_message).first()
        if user:
            lastname = f"{user.lastname}" if user.lastname else ''
            username = f"{user.username[0]}." if user.username else ''
            middlename = f"{user.middlename[0]}." if user.middlename else ''

            message['fields']['user_id_gave_the_message'] = f"{lastname} {username} {middlename}"

    return JsonResponse({
        'info_task': serialized_task,
        'user_FIO': user_FIO,
        'list_mess': messages,
    })


@login_required
#AJAX Запрос для отображения сообщений к задаче и его описания
def get_messages(request):
    # Получение информации о задаче, на которую мы нажали
    task_id = request.GET.get('task_id_not_ws')  # id задачи, на которую мы нажати
    search_task = Task.objects.filter(id=task_id).first()
    task = search_task.task
    user_id_gave_the_task = f'{search_task.user_id_gave_the_task.lastname if not None else ""} {search_task.user_id_gave_the_task.username if not None else ""} {search_task.user_id_gave_the_task.middlename if not None else ""}'
    created_task = search_task.created_task if not None else ""
    end_the_last_number = search_task.end_the_last_number if not None else ""
    end_task_time_new = search_task.end_task_time_new if not None else "Не завершена"
    status_task = search_task.status_task

    # Получение сообщений к этой задаче
    search_message_for_task = Message.objects.filter(id_task=task_id)
    serialized_messages = serialize('json', search_message_for_task)

    messages = json.loads(serialized_messages)
    # Чтобы изменить id на ФИО того, кто написал сообщение, используем код ниже
    for message in messages:
        user_id_gave_the_message = message['fields']['user_id_gave_the_message']
        user = CustomUser.objects.filter(id=user_id_gave_the_message).first()
        if user:
            lastname = f"{user.lastname}" if user.lastname else ''
            username = f"{user.username[0]}." if user.username else ''
            middlename = f"{user.middlename[0]}." if user.middlename else ''

            message['fields']['user_id_gave_the_message'] = f"{lastname} {username} {middlename}"

    return JsonResponse({
        'search_message_for_task': messages, # Наши сообщения для задачи под id=task_id
        'status_task_full': status_task,
        'task_id_full': task_id,
        'task_full': task,
        'user_id_gave_the_task_full': user_id_gave_the_task,
        'created_task_full': created_task,
        'end_the_last_number_full': end_the_last_number,
        'end_task_time_new_full': end_task_time_new,
    })


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'look/register.html', {'form': form})