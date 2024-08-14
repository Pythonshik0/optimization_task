from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('look.urls')),
    path('', include('create_group.urls')),
    path('accounts', include('django.contrib.auth.urls')),
]
