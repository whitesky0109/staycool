# Generated by Django 2.1.2 on 2018-10-19 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('airgg', '0002_auto_20181019_1742'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='game_num',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
