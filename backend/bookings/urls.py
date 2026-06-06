from django.urls import path
from . import views

urlpatterns = [
    path("labour_request/", views.labour_request, name="labour_request"),
    path("land_request/", views.land_request, name="land_request"),
    path("machine_request/", views.machine_request, name="machine_request"),
    path("recieved_request/", views.recieved_request, name="recieved_request"),
    path("sent_request/", views.sent_request, name="sent_request"),
    path("preview_request/", views.preview_request, name="preview_request"),
    path("create_razorpay_order/", views.create_razorpay_order, name="create_razorpay_order"),
    path("verify_razorpay_payment/", views.verify_razorpay_payment, name="verify_razorpay_payment"),
]
