# Generated by Django 4.1.7 on 2024-04-20 08:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('look', '0018_alter_customuser_about_me_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='photo_user',
            field=models.BooleanField(default=False),
        ),
    ]
