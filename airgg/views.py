from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import GameSerializer
from .serializers import UsersSerializer
from .serializers import ChampionSerializer
from .serializers import BanSerializer
from .serializers import UserGameDataSerializer
from .models import Game
from .models import Users
from .models import Champion
from .models import Ban
from .models import UserGameData

from django.shortcuts import render
from django.http import HttpResponse

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

class ChampionViewSet(viewsets.ModelViewSet):
    queryset = Champion.objects.all()
    serializer_class = ChampionSerializer

class BanViewSet(viewsets.ModelViewSet):
    queryset = Ban.objects.all()
    serializer_class = BanSerializer

class UserGameDataViewSet(viewsets.ModelViewSet):
    queryset = UserGameData.objects.all()
    serializer_class = UserGameDataSerializer

def home(request):
	return render(request, "airgg/home.html")

def member(request):
	return render(request, "airgg/member.html")

def ranking(request):
	return render(request, "airgg/ranking.html")

def position(request):
	return render(request, "airgg/position.html")

def stats(request):
	return render(request, "airgg/stats.html")

def profile(request):
	return render(request, "airgg/profile.html")

# Create your views here.
