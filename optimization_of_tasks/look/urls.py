from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='home'),
    path('look_group', views.look_group),
    path('register', views.register, name='register'),
    path('user_login/', auth_views.LoginView.as_view(template_name='look/user_login.html'), name='user_login'),
    path('user_logout/', auth_views.LogoutView.as_view(template_name='look/user_logout.html'), name='user_logout'),
    path('main_page_with_tasks/<int:user_id>', views.main_page_with_tasks, name='main_page_with_tasks'),
    path('get_messages_for_task/', views.get_messages_for_task, name='get_messages_for_task'),
    path('tasks_for_user/', views.tasks_for_user, name='tasks_for_user'),
    path('get_messages/', views.get_messages, name='get_messages'),
    path('info_task_for_user/', views.info_task_for_user, name='info_task_for_user'),
    path('create_message/', views.create_message, name='create_message'),
    path('personal_account/<str:lastname><str:name><str:middle>', views.personal_account, name='personal_account'),
    path('upload_image/', views.upload_image, name='upload_image'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Если я захочу использовать logout, то используй версию Django позже чем 5.0.1,
# а лучше 4.1.7, потому что в 5.0.1 убирается выход через get
