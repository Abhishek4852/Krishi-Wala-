from django.urls import path
from . import views

urlpatterns = [
    path("post_land/", views.post_land, name="post_land"),
    path("labour_registration/", views.labour_registration, name="labour_registration"),
    path("machine_registration/", views.machine_registration, name="machine_registration"),
    path("abhishek4852/", views.abhishek4852, name="abhishek4852"),
    path("get_profile/", views.get_profile, name="get_profile"),
    path("update_profile/", views.update_profile, name="update_profile"),
    path("get_user_listings/", views.get_user_listings, name="get_user_listings"),
    path("update_labour_listing/", views.update_labour_listing, name="update_labour_listing"),
    path("update_land_listing/", views.update_land_listing, name="update_land_listing"),
    path("update_machine_listing/", views.update_machine_listing, name="update_machine_listing"),
]
