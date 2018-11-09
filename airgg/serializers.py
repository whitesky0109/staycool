from airgg.models import Users
from airgg.models import Game
from airgg.models import Champion
from airgg.models import Ban
from airgg.models import UserGameData
from rest_framework import serializers

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('game_num', 'season', 'duration', 'team1', 'team2', 'date')

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'age', 'location', 'preference_line', 'name' ,'member', 'position')

class ChampionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Champion
        fields = ('champion', 'info_url')

class BanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ban
        fields = ('champion', 'game_num')

class UserGameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameData
        fields = ('user_id', 'game_num', 'champion', 'line', 'kill', 'death', 'asist', 'cs', 'gold', 'level', 'win', 'team_num')
