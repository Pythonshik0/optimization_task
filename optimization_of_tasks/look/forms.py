from django import forms
from .models import CustomUser, Message, UpdateFileinMessage
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


#Форма регистрации пользователей
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['login', 'email', 'username', 'lastname', 'middlename']


#Форма регистрации пользователей
class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ['login', 'email', 'username', 'lastname', 'middlename']


#Форма создания сообщений
class CreateMessage(ModelForm):
    file_upload = forms.FileField(required=False)  # Добавляем поле для загрузки файла

    class Meta:
        model = Message
        fields = ["message", "file"]
