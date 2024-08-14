from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter

from django.core.asgi import get_asgi_application
from django.urls import path
from look.consumers import ChatConsumer, ChatConsumerMessage
import look.routing

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'optimization_of_tasks.settings')


application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            look.routing.websocket_urlpatterns
        )
    ),
})