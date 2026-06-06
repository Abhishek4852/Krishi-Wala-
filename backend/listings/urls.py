from django.urls import path
from . import views

urlpatterns = [
    path("post_land/", views.post_land, name="post_land"),
    path("labour_registration/", views.labour_registration, name="labour_registration"),
    path("machine_registration/", views.machine_registration, name="machine_registration"),
    path("abhishek4852/", views.abhishek4852, name="abhishek4852"),
]
