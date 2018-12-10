from django.db import models
from datetime import timedelta

class Game(models.Model):
	game_num = models.AutoField(primary_key=True)
	season = models.PositiveIntegerField()
	date = models.DateTimeField()
	duration = models.DurationField(default=timedelta)

class Users(models.Model):
	user_id = models.CharField(max_length=100, primary_key=True)
	preference_line = models.CharField(max_length=100)
	member = models.BooleanField()
	position = models.CharField(max_length=100, default='member')

class Champion(models.Model):
	champion = models.CharField(max_length=100, primary_key=True)
	info_url = models.CharField(max_length=255)

class Ban(models.Model):

	class Meta:
		unique_together = (('champion','game_num'),)

	champion = models.ForeignKey(Champion, on_delete=models.CASCADE)
	game_num = models.ForeignKey(Game, on_delete=models.CASCADE)

class Line(models.Model):
	line = models.CharField(max_length=5, default='UNKNOWN', primary_key=True)

class UserGameData(models.Model):

	class Meta:
		unique_together = (('user_id','game_num','champion','line'),)

	user_id = models.ForeignKey(Users, on_delete=models.CASCADE)
	game_num = models.ForeignKey(Game, on_delete=models.CASCADE)
	champion = models.ForeignKey(Champion, on_delete=models.CASCADE)
	line = models.ForeignKey(Line, on_delete=models.CASCADE)
	kill = models.SmallIntegerField()
	death = models.SmallIntegerField()
	asist = models.SmallIntegerField()
	cs = models.SmallIntegerField()
	gold = models.PositiveIntegerField()
	level = models.SmallIntegerField()
	win = models.BooleanField()
	
# Create your models here.
