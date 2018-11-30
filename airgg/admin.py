from django.contrib import admin
from .models import Game
from .models import Users
from .models import Champion
from .models import Line
from .models import Ban
from .models import UserGameData

admin.site.register(Game)
admin.site.register(Users)
admin.site.register(Champion)
admin.site.register(Line)
admin.site.register(Ban)
admin.site.register(UserGameData)

# Register your models here.
