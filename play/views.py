from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import PlayerSerializer
from .serializers import GameSerializer
from .models import Player 
from .models import Game

from django.shortcuts import render
from django.http import HttpResponse

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    #permission_classes = [IsAuthenticated, IsAdmin, IsAccountAdminOrReadOnly]

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    #permission_classes = [IsAuthenticated, IsAdmin, IsAccountAdminOrReadOnly]

def home(request):
	return render(request, "airgg/home.html")

def ranking(request):
	return render(request, "airgg/ranking.html")

def position(request):
	return render(request, "airgg/position.html")

def stats(request):
	return render(request, "airgg/stats.html")

# Create your views here.
