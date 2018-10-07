from django.db import models

class Player(models.Model):
	name = models.CharField(max_length=10)
	rank = models.CharField(max_length=10)

	def __str__(self):
		return self.name

class Game(models.Model):
	game = models.CharField(max_length=40)

	def __str__(self):
		return self.game

# Create your models here.
