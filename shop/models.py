from django.db import models
from django.conf import settings
from food.models import Ingredient



class UserData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ingredients = models.ManyToManyField(Ingredient, blank=True)
    point = models.PositiveIntegerField(default=0)
    # 구매한 마트 칼럼 추가 예정
