import datetime
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Task, Message, CustomUser
from asgiref.sync import sync_to_async
import uuid


#Отправка задачи
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['user_id']
        # self.room_name = self.scope['user'].id
        self.room_name = 'MAIN'
        self.room_group_name = 'main_page_with_tasks_%s' % self.room_name

        print('Я ТУТ 1')
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        task = text_data_json['task']
        give_task_id = text_data_json['give_task_id']
        user_id_gave_the_task = text_data_json['user_id_gave_the_task']
        user_id = text_data_json['user_id']
        result = text_data_json['result']
        datestart = text_data_json['datestart']
        timestart = text_data_json['timestart']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'task': task,
                'give_task_id': give_task_id,
                'user_id_gave_the_task': user_id_gave_the_task,
                'user_id': user_id,
                'result': result,
                'datetime_start': f'{datestart} {timestart}' #Дата и время начала задачи
            }
        )

    async def chat_message(self, event):
        result = event.get('result')
        task = event.get('task')
        give_task_id = event.get('give_task_id')
        user_id_gave_the_task = event.get('user_id_gave_the_task')
        ID_user_id_gave_the_task = event.get('user_id')
        datetime_start = event.get('datetime_start')

        if give_task_id is not None:
            # Отправка данных через WebSocket
            await self.send(text_data=json.dumps({
                'task': task,
                'user_id_gave_the_task': user_id_gave_the_task, #ФИО того кто дал задачу
                'give_task_id_id': give_task_id, #id того, кому дали задачу
                'result': result, #Номер задачи, котору сохранили в бд
                'status_task': 'Не получил',
                'ID_user_id_gave_the_task': ID_user_id_gave_the_task, #id того, кто выдал задачу
                'datetime_start': datetime_start,
            }))


#Отправка сообщений к задаче
class ChatConsumerMessage(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['id_task_for_message']
        self.room_group_name = 'main_page_with_tasks_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        task_id_main = text_data_json['task_id_main']
        user = text_data_json['user']
        FIO_message = text_data_json['FIO_message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': message,
                'task_id_main': task_id_main,
                'user': user,
                'FIO_message': FIO_message,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        task_id_main = event['task_id_main']
        user = event['user']
        FIO_message = event['FIO_message']

        await self.send(text_data=json.dumps({
            'message': message,
            'task_id_main': task_id_main,
            'user': user,
            'datetime_message': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'FIO_message': FIO_message,
        }))

