# Generated by Django 4.1.7 on 2024-04-19 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('look', '0013_alter_customuser_links_to_messengers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='links_to_messengers',
            field=models.CharField(default=None, max_length=300),
        ),
    ]
