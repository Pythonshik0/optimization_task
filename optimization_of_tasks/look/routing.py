from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/main_page_with_tasks/MAIN', consumers.ChatConsumer.as_asgi()),#(?P<user_id>\w+)/$
    re_path(r'ws/main_page_with_tasks/(?P<id_task_for_message>\w+)/$', consumers.ChatConsumerMessage.as_asgi()),
]