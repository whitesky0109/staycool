from django.db import models

class Game(models.Model):
	game_num = models.AutoField(primary_key=True)
	season = models.PositiveIntegerField()
	date = models.DateTimeField()
	team1 = models.IntegerField()
	team2 = models.IntegerField()
	duration = models.DurationField()


class Users(models.Model):
	user_id = models.CharField(max_length=100, primary_key=True)
	age = models.PositiveIntegerField()
	location = models.CharField(max_length=100)
	preference_line = models.CharField(max_length=100)
	name = models.CharField(max_length=100)
	member = models.BooleanField()

	def __str__(self):
		return self.user_id

class Champion(models.Model):
	champion = models.CharField(max_length=100, primary_key=True)
	img_url = models.CharField(max_length=255)
	info_url = models.CharField(max_length=255)

	def __str__(self):
		return self.champion

class Ban(models.Model):

	class Meta:
		unique_together = (('champion','game_num'),)

	champion = models.ForeignKey(Champion, on_delete=models.CASCADE)
	game_num = models.ForeignKey(Game, on_delete=models.CASCADE)

	def __str__(self):
		return self.champion

class UserGameData(models.Model):

	class Meta:
		unique_together = (('user_id','game_num','champion'),)

	user_id = models.ForeignKey(Users, on_delete=models.CASCADE)
	game_num = models.ForeignKey(Game, on_delete=models.CASCADE)
	champion = models.ForeignKey(Champion, on_delete=models.CASCADE)
	line = models.CharField(max_length=100, default='unknown')
	kill = models.SmallIntegerField()
	death = models.SmallIntegerField()
	asist = models.SmallIntegerField()
	cs = models.SmallIntegerField()
	gold = models.PositiveIntegerField()
	level = models.SmallIntegerField()
	win = models.BooleanField()
	team_num = models.SmallIntegerField()
	
	def __str__(self):
		return self.user_id

# Create your models here.
