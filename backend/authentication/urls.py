from django.urls import path
from . import views

urlpatterns = [
    path('v2/', views.Registration, name='Registration'),
    path('v2/register/', views.Registration, name='Registration_alias'),
    path('v2/login/', views.login, name="login"),
    path("v2/token_validation/", views.token_validation, name="token_validation"),
    path("v2/load-db/", views.load_db_from_json, name="load_db_from_json"),
]
