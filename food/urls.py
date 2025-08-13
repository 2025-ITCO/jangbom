from django.urls import path
from .views import *

app_name = 'food'

urlpatterns = [
    path('', main, name='main'),
    path('reset_shoppinglist/', reset_shoppinglist_view, name='reset_shoppinglist'),
    # 1. 요리를 할거야
    path('recipe/start/', recipe_input_view, name='recipe_input'),
    path('recipe/ingredients/', recipe_ingredient_result, name='recipe_ingredients'),
    path('recipe/ingredients/search/', ingredient_search_view, name='ingredient_search'),
    path('recipe/ingredients/search/add/', add_extra_ingredient, name='add_extra_ingredient'),
    path('recipe/ingredients/search/delete/<str:name>/', delete_extra_ingredient, name='delete_extra_ingredient'),
    path('recipe/ingredients/recent/delete/<str:keyword>/', delete_recent_search, name='delete_recent_search'),
    path('recipe/ingredients/recent/clear/', clear_recent_searches, name='clear_recent_searches'),
    path('recipe/ingredients/search/cancel/', cancel_ingredient_search, name='cancel_ingredient_search'),
    path('recipe/confirm/', confirm_shopping_list, name='confirm_shopping_list'),
    path('recipe/ai/', recipe_ai, name='recipe_ai'),

    # 2. 식재료를 고를거야
    path('ingredient/', ingredient_input_view, name='ingredient_input'),
    path('ingredient/add/', add_ingredient, name='add_ingredient'),
    path('ingredient/delete/<str:name>/', delete_ingredient, name='delete_ingredient'),
    path('ingredient/recent/delete/<str:keyword>/', delete_recent_ingredient, name='delete_recent_ingredient'),
    path('ingredient/recent/clear/', clear_recent_ingredient, name='clear_recent_ingredient'),
    path('ingredient/result/', ingredient_result_view, name='ingredient_result'),
    path('ingredient/ai/<str:name>/', ingredient_ai_view, name='ingredient_ai'),
    path("ingredient/add_ai/", add_ingredient_ai, name="add_ingredient_ai"),

    # 3. 남은 식재료로 요리 추천받기
    path("leftover/select/", select_recent_ingredients, name="select_recent_ingredients"),
    path("leftover/chat/", chat_with_selected_ingredients, name="chat_with_selected_ingredients"),
    path("leftover/save/", save_last_recipe, name="save_last_recipe"),
    path("leftover/clear/", clear_recipe_chat, name="clear_recipe_chat"),
]