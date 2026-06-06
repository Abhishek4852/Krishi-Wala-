from django.db import models

class LabourRequest(models.Model):
    receiver_mobile = models.CharField("Receiver Mobile Number", max_length=15)
    name = models.CharField("Sender Name", max_length=100)
    sender_mobile = models.CharField("Sender Mobile Number", max_length=15)
    workTime = models.CharField("Work Time", max_length=20)
    workUnit = models.CharField("Work Unit", max_length=10)

    state = models.CharField("State", max_length=100)
    district = models.CharField("District", max_length=100)
    village = models.CharField("Village", max_length=100)

    workType = models.CharField("Work Type", max_length=100)
    otherWork = models.CharField("Other Work", max_length=100, blank=True, null=True)
    description = models.TextField("Description", blank=True, null=True)
    period_start = models.DateField("Period Start")
    period_end = models.DateField("Period End")
    status = models.CharField("Status", max_length=20)
    request_date = models.CharField("Request Date", max_length=20)

    preview_description = models.TextField("Preview Description", blank=True, null=True)
    request_price = models.CharField("Request Price", max_length=50, blank=True, null=True)
    preview_date = models.CharField("Preview Date", max_length=20, blank=True, null=True)

class LandRequest(models.Model):
    name = models.CharField("Sender Name", max_length=100)
    sender_mobile = models.CharField("Sender Mobile Number", max_length=15)
    landSize = models.CharField("Land Size", max_length=50)

    period_start = models.DateField("Renting Period Start")
    period_end = models.DateField("Renting Period End")

    description = models.TextField("Description", blank=True, null=True)
    receiver_mobile = models.CharField("Receiver Mobile Number", max_length=15)
    status = models.CharField("Status", max_length=20, default="pending")

    request_date = models.CharField("Request Date", max_length=20)
    land_id = models.IntegerField("Land ID") 

    preview_description = models.TextField("Preview Description", blank=True, null=True)
    request_price = models.CharField("Request Price", max_length=50, blank=True, null=True)
    preview_date = models.CharField("Preview Date", max_length=20, blank=True, null=True)

class MachineRequest(models.Model):
    name = models.CharField("Sender Name", max_length=100)
    sender_mobile = models.CharField("Sender Mobile Number", max_length=15)
    hour = models.CharField("Hour", max_length=50)

    period_start = models.DateField("Renting Period Start")
    period_end = models.DateField("Renting Period End")

    state = models.CharField("State", max_length=100)
    district = models.CharField("District", max_length=100)
    village = models.CharField("Village", max_length=100)

    description = models.TextField("Description", blank=True, null=True)
    status = models.CharField("Status", max_length=20, default="pending")

    machine_id = models.IntegerField("Machine ID")
    machine_name = models.CharField("Machine Name", max_length=100)
    receiver_mobile = models.CharField("Receiver Mobile (Owner)", max_length=15)

    request_date = models.CharField("Request Date", max_length=20)

    preview_description = models.TextField("Preview Description", blank=True, null=True)
    request_price = models.CharField("Request Price", max_length=50, blank=True, null=True)
    preview_date = models.CharField("Preview Date", max_length=20, blank=True, null=True)

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    order_id = models.CharField("Razorpay Order ID", max_length=100, unique=True)
    razorpay_payment_id = models.CharField("Razorpay Payment ID", max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField("Razorpay Signature", max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="created")  # created, paid, failed
    request_type = models.CharField("Request Type (Land, Labour, Machine)", max_length=20)
    request_id = models.IntegerField("Associated Request ID")
    created_at = models.DateTimeField(auto_now_add=True)
