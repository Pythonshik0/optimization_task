# Generated by Django 4.1.7 on 2024-02-13 15:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('look', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='file',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='look.updatefileinmessage'),
        ),
    ]
