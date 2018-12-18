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

urlpatterns = [
    path('admin/', admin.site.urls),

    url(r'^$', views.home, name='airgg'),
    url(r'^member/', views.member, name='member'),
    url(r'^ranking/', views.ranking, name='ranking'),
    url(r'^stats/', views.stats, name='stats'),
    url(r'^position/', views.position, name='position'),
    url(r'^profile/', views.profile, name='profile'),
    url(r'^dev/$',views.dev, name='dev'),

    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^f/members/$', views.filter_members, name='users'),
    url(r'^f/profile/$', views.filter_user_profile, name='profile'),
    url(r'^f/updatedate/$', views.filter_update_date, name='update_date'),
    url(r'^f/season/profile/$', views.filter_test, name='test'),
    url(r'^f/season/gamewin/$', views.filter_game_win, name='gamewin'),
    url(r'^f/season/users/$', views.filter_users, name='season'),
    url(r'^f/season/pickban/$', views.filter_pick_ban, name='month'),
    url(r'^f/season/duo/$', views.filter_duo_win, name='duo'),
    url(r'^f/month/users/$', views.filter_month_best, name='month'),
    url(r'^f/team/$', views.filter_team, name='team')
]
