import os
import django
import random
import requests
import uuid
from io import BytesIO
import cloudinary.uploader
from django.core.files.uploadedfile import InMemoryUploadedFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'KrishiWala.settings')
django.setup()

from authentication.models import User
from listings.models import Land, LandPhotos, Labour, LabourBank, Machine, MachineImage, MachineAccount
from django.contrib.auth.hashers import make_password

def download_image(category, index):
    """Download a placeholder image based on category."""
    if category == "machine":
        url = f"https://loremflickr.com/320/240/tractor?random={index}"
    elif category == "labour":
        url = f"https://loremflickr.com/320/240/farmer?random={index}"
    else:
        url = f"https://loremflickr.com/320/240/field?random={index}"
        
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.content
    except Exception as e:
        print(f"Failed to download image for {category}: {e}")
    return None

def upload_to_cloudinary(image_content, folder_name):
    """Uploads binary image content to Cloudinary and returns the result dict."""
    try:
        result = cloudinary.uploader.upload(
            image_content, 
            folder=f"krishiwala_seeds/{folder_name}"
        )
        return result['public_id']
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        return None

def seed_data():
    print("Starting data seeding...")
    
    user_email = "testuser@example.com"
    user_mobile = "9998887776"
    
    # 1. Create or get test user
    user, created = User.objects.get_or_create(
        email=user_email,
        defaults={
            'name': 'Test User',
            'mobile': user_mobile,
            'password': make_password('password123'),
            'is_admin': False
        }
    )
    if not created:
        user.password = make_password('password123')
        user.mobile = user_mobile
        user.save()
        
    print(f"User ready: {user_email} / password123")

    # We need 50 distinct images for each category, but creating 100 records.
    # We will upload 50 images per category to Cloudinary and cycle through them.
    
    print("Uploading Land Images to Cloudinary...")
    land_image_ids = []
    for i in range(50):
        print(f"Uploading land image {i+1}/50...")
        content = download_image("land", i)
        if content:
            pid = upload_to_cloudinary(content, "lands")
            if pid:
                land_image_ids.append(pid)
                
    if not land_image_ids:
        print("Warning: Failed to upload any land images. Proceeding without images.")

    print("Uploading Labour Images to Cloudinary...")
    labour_image_ids = []
    for i in range(50):
        print(f"Uploading labour image {i+1}/50...")
        content = download_image("labour", i)
        if content:
            pid = upload_to_cloudinary(content, "labours")
            if pid:
                labour_image_ids.append(pid)

    print("Uploading Machine Images to Cloudinary...")
    machine_image_ids = []
    for i in range(50):
        print(f"Uploading machine image {i+1}/50...")
        content = download_image("machine", i)
        if content:
            pid = upload_to_cloudinary(content, "machines")
            if pid:
                machine_image_ids.append(pid)

    states = ["Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Maharashtra"]
    districts = ["Indore", "Bhopal", "Pune", "Jaipur", "Lucknow"]
    
    # Generate 100 records for each
    print("Generating 100 Land records...")
    for i in range(100):
        land = Land.objects.create(
            name=user.name,
            state=random.choice(states),
            district=random.choice(districts),
            village=f"Village_{i}",
            mobile=user.mobile,
            LandSize=random.randint(5, 50),
            TotalRentPrice=random.randint(50000, 200000),
            RentPricePerAcre=random.randint(5000, 10000),
            rentPeriod=random.randint(6, 24),
            irrigationSource=random.choice(["Canal", "Tube Well", "Rain"]),
            extraFacilities="Water, Electricity",
            AccName=user.name,
            BankName="SBI",
            AccNo=f"100200300{i}",
            IFSC="SBIN0001111",
            map_location=f"22.7196, 75.857{i}"
        )
        if land_image_ids:
            # Randomly assign one of the 50 images
            pid = random.choice(land_image_ids)
            LandPhotos.objects.create(land_id=land, image=pid)

    print("Generating 100 Labour records...")
    for i in range(100):
        pid = random.choice(labour_image_ids) if labour_image_ids else ""
        labour = Labour.objects.create(
            name=f"Labour_{i}",
            mobile=user.mobile,
            selected_state=random.choice(states),
            selected_district=random.choice(districts),
            selected_village=f"Village_{i}",
            work_type=random.choice(["Harvesting", "Sowing", "Weeding"]),
            price=random.randint(300, 800),
            price_type="Per Day",
            age=random.randint(20, 50),
            gender=random.choice(["Male", "Female"]),
            experience=random.randint(1, 15),
            avatar=pid
        )
        LabourBank.objects.create(
            labour=labour,
            bname=f"Labour_{i}",
            bank_name="PNB",
            b_account_no=f"200300400{i}",
            IFSC="PUNB0002222"
        )

    print("Generating 100 Machine records...")
    for i in range(100):
        machine = Machine.objects.create(
            owner_name=user.name,
            mobile_no=user.mobile,
            state=random.choice(states),
            district=random.choice(districts),
            village=f"Village_{i}",
            machine_name=random.choice(["Tractor", "Harvester", "Seeder"]),
            purpose=random.choice(["Ploughing", "Harvesting"]),
            specification="Standard model",
            with_tractor=random.choice([True, False]),
            tractor_company="Mahindra" if i % 2 == 0 else "John Deere",
            tractor_model=f"Model-{i}",
            hiring_cost_acre=random.randint(1000, 3000),
            hiring_cost_hour=random.randint(500, 1500),
            quantity=random.randint(1, 5)
        )
        if machine_image_ids:
            pid = random.choice(machine_image_ids)
            MachineImage.objects.create(machine=machine, image=pid)
        MachineAccount.objects.create(
            machine=machine,
            bname=user.name,
            bank_name="HDFC",
            account_no=f"300400500{i}",
            ifsc="HDFC0003333"
        )

    print("Data seeding completed successfully!")
    print(f"Login Credentials:\nEmail: {user_email}\nPassword: password123")

if __name__ == "__main__":
    seed_data()
