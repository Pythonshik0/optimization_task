# Generated by Django 4.1.7 on 2024-04-19 09:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('look', '0008_customuser_links_to_messengers_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='links_to_messengers',
        ),
    ]
