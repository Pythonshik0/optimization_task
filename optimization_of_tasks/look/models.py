from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import CustomUserManager
from django.utils import timezone
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType


#Модель для регистрации пользователей
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    middlename = models.CharField(max_length=20)
    login = models.CharField(max_length=20, unique=True)  # Поле login делаем уникальным
    type_of_subscription = models.CharField(max_length=30)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    # Для личного кабинета
    about_me = models.CharField(max_length=100) #Графа о себе
    position = models.CharField(max_length=100) # Должность
    links_to_messengers = models.CharField(max_length=300) # Ссылки на мессенджеры
    notify_email = models.BooleanField(default=True) # Уведомления для почты
    notify_site = models.BooleanField(default=True)  # Уведомления на сайте
    photo_user = models.CharField(max_length=10) # Фото пользователя

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'login']  # Указываем обязательные поля кроме email

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Profile(models.Model):
        user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
        image = models.ImageField(default='default.jpg', upload_to='profile_pics')

        def __str__(self):
            return f'{self.user.username} Profile'


class Task(models.Model):
    user_id_gave_the_task = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tasks_given')#Кто дал задачу
    task = models.CharField(max_length=1000)# Сама задача
    #user = models.IntegerField(null=True, blank=True)#Кому дали задачу
    user = models.ManyToManyField(CustomUser, related_name='tasks_assigned') #Кому дали задачу
    created_task = models.DateTimeField(default=timezone.now)#Время создания задачи
    #blank - делает так, чтобы формы не требовали заполнения поля(делаем его необязательным)
    end_task_time_new = models.DateTimeField(null=True, blank=True)#Когда и во сколько была завершена задача
    end_the_last_number = models.DateTimeField()#До какого числа нужно сделать задачу
    STATUS_CHOICES = (
        ('Не получил', 'Не получил'),
        ('В работе', 'В работе'),
        ('Готово', 'Готово'),
    )
    status_task = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Не получил', blank=True)
    project = models.CharField(max_length=100, default=False)
    company = models.CharField(max_length=100, default=False)

    def __str__(self):
        return f'id: {self.id}'


class UpdateFileinMessage(models.Model):
    name_file = models.CharField(max_length=100)

    def __str__(self):
        return self.name_file


class Message(models.Model):
    user_id_gave_the_message = models.ForeignKey(CustomUser, on_delete=models.CASCADE)#Кто написал сообщение
    message = models.CharField(max_length=1000)# Сообщение
    id_task = models.ForeignKey(Task, on_delete=models.CASCADE)#К какой задаче отн-тся сообщение
    created_message = models.DateTimeField(default=timezone.now)#Время создания сообщения
    file = models.ForeignKey(UpdateFileinMessage, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'Для задачи: {self.id_task}'


