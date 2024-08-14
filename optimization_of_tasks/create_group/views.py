from django.shortcuts import render
from django.http import HttpResponse


def create_group(request):
    return HttpResponse('<h4>Создание пользователя</h4>')