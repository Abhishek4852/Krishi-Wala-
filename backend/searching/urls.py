from django.urls import path
from . import views

urlpatterns = [
    path("filter_land/", views.filter_land, name="filter_land"),
    path("search_machine/", views.search_machine, name="search_machine"),
    path("search_labour/", views.search_labour, name="search_labour"),
]
