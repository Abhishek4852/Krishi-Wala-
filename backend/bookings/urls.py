from django.urls import path
from . import views

urlpatterns = [
    path("v2/labour_request/", views.labour_request, name="labour_request"),
    path("v2/land_request/", views.land_request, name="land_request"),
    path("v2/machine_request/", views.machine_request, name="machine_request"),
    path("v2/recieved_request/", views.recieved_request, name="recieved_request"),
    path("v2/sent_request/", views.sent_request, name="sent_request"),
    path("v2/preview_request/", views.preview_request, name="preview_request"),
    path("v2/create_razorpay_order/", views.create_razorpay_order, name="create_razorpay_order"),
    path("v2/verify_razorpay_payment/", views.verify_razorpay_payment, name="verify_razorpay_payment"),
    path("v2/check_payment_readiness/", views.check_payment_readiness, name="check_payment_readiness"),
    path("v2/transaction_history/", views.transaction_history, name="transaction_history"),
]
