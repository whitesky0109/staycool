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
router.register(r'db/Game', views.GameViewSet)
router.register(r'db/Users', views.UsersViewSet)
router.register(r'db/Champion', views.ChampionViewSet)
router.register(r'db/Ban', views.BanViewSet)
router.register(r'db/UserGameData', views.UserGameDataViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('airgg/', views.home, name='airgg'),
    path('airgg/ranking/', views.ranking, name='ranking'),
    path('airgg/stats/', views.stats, name='stats'),
    path('airgg/position/', views.position, name='position'),
    path('airgg/profile/', views.profile, name='profile'),

    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
