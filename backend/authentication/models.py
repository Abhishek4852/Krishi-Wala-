from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    mobile = models.CharField(max_length=10, unique=True)
    email = models.EmailField()
    password = models.CharField(max_length=255)  # Extended length to fit hashed passwords
    is_admin = models.BooleanField(default=False)

