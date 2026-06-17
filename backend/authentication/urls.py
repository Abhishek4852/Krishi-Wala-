from django.urls import path
from . import views

urlpatterns = [
    path('', views.Registration, name='Registration'),
    path('register/', views.Registration, name='Registration_alias'),
    path('login/', views.login, name="login"),
    path("token_validation/", views.token_validation, name="token_validation"),
    path("load-db/", views.load_db_from_json, name="load_db_from_json"),
    path("krishi-ai/", views.krishi_ai, name="krishi_ai"),
]
