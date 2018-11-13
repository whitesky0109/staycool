"""trunk URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.views.generic.base import TemplateView
from rest_framework import routers
from airgg import views

router = routers.DefaultRouter()
router.register(r'Game', views.GameViewSet)
router.register(r'Users', views.UsersViewSet)
router.register(r'Champion', views.ChampionViewSet)
router.register(r'Ban', views.BanViewSet)
router.register(r'UserGameData', views.UserGameDataViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    url(r'^$', views.home, name='airgg'),
    url(r'^member/', views.member, name='member'),
    url(r'^ranking/', views.ranking, name='ranking'),
    url(r'^stats/', views.stats, name='stats'),
    url(r'^position/', views.position, name='position'),
    url(r'^profile/', views.profile, name='profile'),

    url(r'^db/', include(router.urls)),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^f/profile/$', views.filter_user_profile, name='profile'),
    url(r'^f/season/gamewin/$', views.filter_game_win, name='gamewin'),
    url(r'^f/season/users/$', views.filter_season_ranking, name='season'),
    url(r'^f/season/pickban/$', views.filter_pick_ban, name='month'),
    url(r'^f/month/users/$', views.filter_month_best, name='month'),
]
