from play.models import Player
from play.models import Game
from rest_framework import serializers

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('name','rank')

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('game')

