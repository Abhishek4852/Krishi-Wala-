from django.db import models
from authentication.models import User
from cloudinary.models import CloudinaryField

class Land(models.Model):
    land_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    village = models.CharField(max_length=50)
    mobile = models.CharField(max_length=50)
    LandSize = models.IntegerField()
    TotalRentPrice = models.IntegerField()
    RentPricePerAcre = models.IntegerField()
    rentPeriod = models.IntegerField()
    irrigationSource = models.CharField(max_length=100)
    extraFacilities = models.CharField(max_length=200)
    AccName = models.CharField(max_length=50, blank=True, null=True)
    BankName = models.CharField(max_length=50, blank=True, null=True)
    AccNo = models.CharField(max_length=20, blank=True, null=True)
    IFSC = models.CharField(max_length=20, blank=True, null=True)
    map_location = models.CharField(max_length=200)  # Extended length to accommodate longer links/locations

class LandPhotos(models.Model):
    id = models.AutoField(primary_key=True)
    land_id = models.ForeignKey(Land, on_delete=models.CASCADE)
    image = CloudinaryField('image')

class Labour(models.Model):
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    selected_state = models.CharField(max_length=100)
    selected_district = models.CharField(max_length=100)
    selected_village = models.CharField(max_length=100)
    work_type = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=50, choices=[("Per Day", "Per Day"), ("Per Hour", "Per Hour")])
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")])
    experience = models.IntegerField(default=0)
    avatar = CloudinaryField('avatar', null=True, blank=True)
    availability_time = models.CharField(max_length=100, blank=True, null=True, default="Full Time")
    is_available = models.BooleanField(default=True)

class LabourBank(models.Model):
    labour = models.OneToOneField(Labour, on_delete=models.CASCADE, related_name="bank_details")
    bname = models.CharField(max_length=255, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    b_account_no = models.CharField(max_length=50, blank=True, null=True)
    IFSC = models.CharField(max_length=20, blank=True, null=True)

class Machine(models.Model):
    owner_name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    village = models.CharField(max_length=100)
    machine_name = models.CharField(max_length=255)
    purpose = models.CharField(max_length=255)
    specification = models.TextField()
    with_tractor = models.BooleanField(default=False)
    tractor_company = models.CharField(max_length=255, blank=True, null=True)
    tractor_model = models.CharField(max_length=255, blank=True, null=True)
    hiring_cost_acre = models.IntegerField()
    hiring_cost_hour = models.IntegerField()
    quantity = models.PositiveIntegerField()

class MachineImage(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name="images")
    image = CloudinaryField('image')

class MachineAccount(models.Model):
    machine = models.OneToOneField(Machine, on_delete=models.CASCADE)
    bname = models.CharField(max_length=255, blank=True, null=True)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    account_no = models.CharField(max_length=20, blank=True, null=True)
    ifsc = models.CharField(max_length=20, blank=True, null=True)
