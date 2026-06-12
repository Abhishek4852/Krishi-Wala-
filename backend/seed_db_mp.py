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
    """Download a placeholder image based on category with Indian agriculture context."""
    if category == "machine":
        url = f"https://loremflickr.com/320/240/tractor,india?random={index}"
    elif category == "labour":
        url = f"https://loremflickr.com/320/240/indian,farmer?random={index}"
    else:
        url = f"https://loremflickr.com/320/240/indian,farm?random={index}"
        
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
            folder=f"krishiwala_seeds/mp/{folder_name}"
        )
        return result['public_id']
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        return None

def seed_data():
    print("Starting MP specific data seeding...")
    
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

    # Upload 15 images per category to save time, then distribute them among 100 records
    print("Uploading Land Images (MP style) to Cloudinary...")
    land_image_ids = []
    for i in range(15):
        print(f"Uploading land image {i+1}/15...")
        content = download_image("land", i)
        if content:
            pid = upload_to_cloudinary(content, "lands")
            if pid:
                land_image_ids.append(pid)

    print("Uploading Labour Images (MP style) to Cloudinary...")
    labour_image_ids = []
    for i in range(15):
        print(f"Uploading labour image {i+1}/15...")
        content = download_image("labour", i)
        if content:
            pid = upload_to_cloudinary(content, "labours")
            if pid:
                labour_image_ids.append(pid)

    print("Uploading Machine Images (MP style) to Cloudinary...")
    machine_image_ids = []
    for i in range(15):
        print(f"Uploading machine image {i+1}/15...")
        content = download_image("machine", i)
        if content:
            pid = upload_to_cloudinary(content, "machines")
            if pid:
                machine_image_ids.append(pid)

    locations = [
        {"state": "Madhya Pradesh", "district": "Hoshangabad", "village": "satwasa"},
        {"state": "Madhya Pradesh", "district": "Shivpuri", "village": "khaniyadhana"}
    ]
    
    mp_labour_names = [
        "Ram Singh", "Rameshwar", "Shivraj", "Kamal", "Mohan", "Babulal", "Ganshyam", 
        "Kailash", "Narayan", "Dinesh", "Suresh", "Raju", "Pappu", "Munna", "Hariom", 
        "Sitaram", "Kishan", "Radheshyam", "Manoj", "Laxman", "Govind", "Bherulal"
    ]
    
    # Generate 50 records for each location (100 total)
    print("Generating 100 Land records for MP locations...")
    for loc_idx, loc in enumerate(locations):
        for i in range(50):
            land = Land.objects.create(
                name=user.name,
                state=loc["state"],
                district=loc["district"],
                village=loc["village"],
                mobile=user.mobile,
                LandSize=random.randint(2, 20),
                TotalRentPrice=random.randint(30000, 150000),
                RentPricePerAcre=random.randint(15000, 30000), # MP rent ranges
                rentPeriod=12,
                irrigationSource=random.choice(["Canal", "Tube Well", "River", "Borewell"]),
                extraFacilities=random.choice(["Water, Electricity", "Storage", "Electricity only"]),
                AccName=user.name,
                BankName="SBI",
                AccNo=f"100200300{i}{loc_idx}",
                IFSC="SBIN0001111",
                map_location=f"22.7, 75.8"
            )
            if land_image_ids:
                pid = random.choice(land_image_ids)
                LandPhotos.objects.create(land_id=land, image=pid)

    print("Generating 100 Labour records for MP locations...")
    for loc_idx, loc in enumerate(locations):
        for i in range(50):
            pid = random.choice(labour_image_ids) if labour_image_ids else ""
            labour = Labour.objects.create(
                name=random.choice(mp_labour_names),
                mobile=user.mobile,
                selected_state=loc["state"],
                selected_district=loc["district"],
                selected_village=loc["village"],
                work_type=random.choice(["Harvesting", "Sowing", "Weeding", "Ploughing", "Irrigation"]),
                price=random.randint(300, 500), # MP daily wages
                price_type="Per Day",
                age=random.randint(20, 55),
                gender=random.choice(["Male", "Female", "Male"]), # More males
                experience=random.randint(1, 20),
                avatar=pid
            )
            LabourBank.objects.create(
                labour=labour,
                bname=labour.name,
                bank_name="PNB",
                b_account_no=f"200300400{i}{loc_idx}",
                IFSC="PUNB0002222"
            )

    print("Generating 100 Machine records for MP locations...")
    for loc_idx, loc in enumerate(locations):
        for i in range(50):
            purpose = random.choice(["Ploughing", "Harvesting", "Sowing"])
            if purpose == "Harvesting":
                m_name = "Harvester"
                cost_acre = random.randint(1200, 2000)
                cost_hour = random.randint(1500, 2500)
            elif purpose == "Ploughing":
                m_name = "Tractor"
                cost_acre = random.randint(800, 1500)
                cost_hour = random.randint(600, 1000)
            else:
                m_name = "Seeder"
                cost_acre = random.randint(500, 1000)
                cost_hour = random.randint(500, 800)
                
            machine = Machine.objects.create(
                owner_name=user.name,
                mobile_no=user.mobile,
                state=loc["state"],
                district=loc["district"],
                village=loc["village"],
                machine_name=m_name,
                purpose=purpose,
                specification="MP Standard model",
                with_tractor=random.choice([True, False]) if m_name != "Tractor" else True,
                tractor_company=random.choice(["Mahindra", "Swaraj", "Eicher", "Sonalika", "John Deere"]),
                tractor_model=f"{random.choice(['DI 744', '575 DI', 'DI 42', 'RX 50'])}",
                hiring_cost_acre=cost_acre,
                hiring_cost_hour=cost_hour,
                quantity=random.randint(1, 3)
            )
            if machine_image_ids:
                pid = random.choice(machine_image_ids)
                MachineImage.objects.create(machine=machine, image=pid)
            MachineAccount.objects.create(
                machine=machine,
                bname=user.name,
                bank_name="HDFC",
                account_no=f"300400500{i}{loc_idx}",
                ifsc="HDFC0003333"
            )

    print("Data seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
