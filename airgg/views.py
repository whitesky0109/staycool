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
from django.core import serializers

from datetime import datetime

try:
	from django.utils import simplejson as json
except ImportError:
	import json

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

def filter_user_profile(request):
	queryset = UserGameData.objects.all()
	q = request.GET.get('userName','')
	if q:
		queryset = queryset.filter(user_id = q)
		qs_json = serializers.serialize('json',queryset)

	return HttpResponse(qs_json, content_type='application/json')

def filter_season_ranking(request):
	game_qs = Game.objects.all()
	user_qs = UserGameData.objects.all()
	q = request.GET.get('season','')
	season_user_data = []

	if q.isdigit() and 0 < int(q) :
		seasonVal = int(q)
	else:
		seasonVal = 1

	game_qs = game_qs.filter(season = seasonVal).values()
	for obj in game_qs:
		season_user_data += user_qs.filter(game_num = obj['game_num'])
		
	qs_json = serializers.serialize('json',season_user_data)

	return HttpResponse(qs_json, content_type='application/json')

def filter_month_best(request):
	game_qs = Game.objects.all()
	user_qs = UserGameData.objects.all()
	month_user_data = []
	year = 2018
	month = 9

	q_year = request.GET.get('year','')
	q_month = request.GET.get('month','')
	if q_year.isdigit():
		year = int(q_year)

	if q_month.isdigit():
		month = int(q_month)

	game_qs = game_qs.filter(date__year=year, date__month=month).values()
	for obj in game_qs:
		month_user_data += user_qs.filter(game_num = obj['game_num'])

	qs_json = serializers.serialize('json',month_user_data)

	return HttpResponse(qs_json, content_type='application/json')

def filter_pick_ban(request):
	season_user_data = []
	season_ban_data = []
	q = request.GET.get('season','')
	
	season_pick_ban = dict()
	
	if q.isdigit() and 0 < int(q) :
		seasonVal = int(q)
	else:
		seasonVal = 1

	game_qs = Game.objects.filter(season = seasonVal).values()
	for obj in game_qs:
		season_user_data += UserGameData.objects.filter(game_num = obj['game_num']).values()
		season_ban_data += Ban.objects.filter(game_num = obj['game_num']).values()

	for obj in season_user_data:
		if obj['champion_id'] in season_pick_ban:
			season_pick_ban[obj['champion_id']]['pick'] = season_pick_ban[obj['champion_id']]['pick'] + 1
			if obj['win'] == 1:
				season_pick_ban[obj['champion_id']]['win'] = season_pick_ban[obj['champion_id']]['win'] + 1
		else:
			season_pick_ban[obj['champion_id']] = dict();
			season_pick_ban[obj['champion_id']]['pick'] = 1;
			season_pick_ban[obj['champion_id']]['ban'] = 0;
			season_pick_ban[obj['champion_id']]['win'] = obj['win'];
		
	for obj in season_ban_data:
		if obj['champion_id'] in season_pick_ban:
			season_pick_ban[obj['champion_id']]['ban'] = season_pick_ban[obj['champion_id']]['ban'] + 1
		else:
			season_pick_ban[obj['champion_id']] = dict();
			season_pick_ban[obj['champion_id']]['pick'] = 0;
			season_pick_ban[obj['champion_id']]['ban'] = 1;
			season_pick_ban[obj['champion_id']]['win'] = 0;

	return HttpResponse(json.dumps(season_pick_ban), content_type='application/json')

def filter_game_win(request):
	game_win_data = {'win1':0,'win2':0}
	q = request.GET.get('season','')
	game_qs = [];

	if q.isdigit() and 0 < int(q) :
		seasonVal = int(q)
		game_qs = Game.objects.filter(season = seasonVal).values()
	else:
		seasonVal = 0
		game_qs = Game.objects.all().values()


	for obj in game_qs:
		print(obj)
		if obj['team1'] == 1:
			game_win_data['win1'] = game_win_data['win1']+1;
		elif obj['team2'] == 1:
			game_win_data['win2'] = game_win_data['win2']+1;


	return HttpResponse(json.dumps(game_win_data), content_type='application/json')
