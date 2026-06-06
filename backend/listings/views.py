from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
from django.conf import settings
import json
import traceback
import jwt
from datetime import datetime

from authentication.decorators import jwt_login_required
from authentication.models import User
from .models import Land, LandPhotos, Labour, LabourBank, Machine, MachineImage, MachineAccount
from bookings.models import LandRequest, LabourRequest, MachineRequest

@csrf_exempt
@jwt_login_required
def post_land(request):
    if request.method == "POST":
        try:
            # Extract form data
            landOwner = request.POST.get("landOwner")
            mobile = request.POST.get("mobile")
            selectedState = request.POST.get("selectedState")
            selectedDistrict = request.POST.get("selectedDistrict")
            selectedVillage = request.POST.get("selectedVillage")
            rentPrice = request.POST.get("rentPrice")
            TotalRentPrice = request.POST.get("TotalRentPrice")
            LandSize = request.POST.get("LandSize")
            rentPeriod = request.POST.get("rentPeriod")
            irrigationSource = request.POST.get("irrigationSource")
            extraFacilities = request.POST.get("extraFacilities")
            googleMapLocation = request.POST.get("googleMapLocation")
            
            # Bank details
            AccName = request.POST.get("bankDetails[name]")
            BankName = request.POST.get("bankDetails[bankName]")
            AccNo = request.POST.get("bankDetails[accountNo]")
            IFSC = request.POST.get("bankDetails[IFSC]")

            # Create a new Land entry
            land = Land.objects.create(
                name=landOwner or request.user.name,
                state=selectedState,
                district=selectedDistrict,
                village=selectedVillage,
                mobile=mobile or request.user.mobile,
                LandSize=LandSize,
                TotalRentPrice=TotalRentPrice,
                RentPricePerAcre=rentPrice,
                rentPeriod=rentPeriod,
                irrigationSource=irrigationSource,
                extraFacilities=extraFacilities,
                AccName=AccName,
                BankName=BankName,
                AccNo=AccNo,
                IFSC=IFSC,
                map_location=googleMapLocation
            )

            # Save Multiple Images (Cloudinary uploads happen automatically via CloudinaryField)
            for file in request.FILES.getlist("landPhotos"):
                LandPhotos.objects.create(land_id=land, image=file)

            return JsonResponse({"message": "Land details saved successfully!", "status": "success"}, status=201)

        except KeyError as e:
            return JsonResponse({"error": f"Missing key: {str(e)}"}, status=400)
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)

@csrf_exempt
@jwt_login_required
def labour_registration(request):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        # Get form data
        name = request.POST.get("name")
        mobile = request.POST.get("mobile")
        selected_state = request.POST.get("selectedState")
        selected_district = request.POST.get("selectedDistrict")
        selected_village = request.POST.get("selectedVillage")
        work_type = request.POST.get("workType")
        price = request.POST.get("price")
        price_type = request.POST.get("priceType")
        age = request.POST.get("age")
        gender = request.POST.get("gender")
        experience = request.POST.get("experience")

        # Get optional bank details
        bname = request.POST.get("bname")
        bank_name = request.POST.get("bankName")
        b_account_no = request.POST.get("bAccountNo")
        ifsc = request.POST.get("IFSC")

        # Get avatar (uploaded file)
        avatar = request.FILES.get("avatar")

        required_fields = [name, mobile, selected_state, selected_district, selected_village, work_type, price, price_type, age, gender, experience]
        if not all(required_fields):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        with transaction.atomic():
            # Insert Labour details
            labour = Labour.objects.create(
                name=name or request.user.name,
                mobile=mobile or request.user.mobile,
                selected_state=selected_state,
                selected_district=selected_district,
                selected_village=selected_village,
                work_type=work_type,
                price=price,
                price_type=price_type,
                age=age,
                gender=gender,
                experience=experience,
                avatar=avatar  # Saved automatically to Cloudinary
            )

            # Insert bank details only if all fields are provided
            if bname and bank_name and b_account_no and ifsc:
                LabourBank.objects.create(
                    labour=labour,
                    bname=bname,
                    bank_name=bank_name,
                    b_account_no=b_account_no,
                    IFSC=ifsc
                )

        return JsonResponse({"message": "Labour registered successfully!", "status": "success"}, status=201)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@jwt_login_required
def machine_registration(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        # Extract form data
        owner_name = request.POST.get("ownerName")
        mobile_no = request.POST.get("Mobileno")
        state = request.POST.get("selectedState")
        district = request.POST.get("selectedDistrict")
        village = request.POST.get("selectedVillage")
        machine_name = request.POST.get("machineName")
        purpose = request.POST.get("purpose")
        specification = request.POST.get("specification")
        with_tractor = request.POST.get("withTractor") == "Yes"  # Convert "Yes" to True
        tractor_company = request.POST.get("tractorCompany", "")
        tractor_model = request.POST.get("tractorModel", "")
        hiring_cost_acre = int(request.POST.get("hiringCostAcre", 0))
        hiring_cost_hour = int(request.POST.get("hiringCostHour", 0))
        quantity = int(request.POST.get("quantity", 1))

        # Create Machine object
        machine = Machine.objects.create(
            owner_name=owner_name or request.user.name,
            mobile_no=mobile_no or request.user.mobile,
            state=state,
            district=district,
            village=village,
            machine_name=machine_name,
            purpose=purpose,
            specification=specification,
            with_tractor=with_tractor,
            tractor_company=tractor_company,
            tractor_model=tractor_model,
            hiring_cost_acre=hiring_cost_acre,
            hiring_cost_hour=hiring_cost_hour,
            quantity=quantity
        )

        # Save bank details
        MachineAccount.objects.create(
            machine=machine,
            bname=request.POST.get("bname"),
            bank_name=request.POST.get("bankName"),
            account_no=request.POST.get("bAccountNo"),
            ifsc=request.POST.get("IFSC")
        )

        # Save uploaded images
        images = request.FILES.getlist("machinePhoto")
        for file in images:
            MachineImage.objects.create(machine=machine, image=file)

        return JsonResponse({"message": "Machine registered successfully!", "status": "success"}, status=201)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def abhishek4852(request):
    """
    Populates dummy listings and requests. Since token is verified as static "Abhishek4852",
    we bypass JWT decoding logic for this endpoint.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if data.get("token") != "Abhishek4852":
                return JsonResponse({"error": "Unauthorized"}, status=401)

            names = ["Abhi", "Rahul", "Priya", "Ankit", "Neha", "Vikas", "Pooja", "Amit", "Kavita", "Rohan"]
            passwords = ["pass123", "test456", "demo789", "abc@123", "xyz@321", "hello@123", "mypwd456", "newpass789", "try321", "secure456"]
            states = ["Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Bihar", "Gujarat"]
            districts = ["Indore", "Bhopal", "Jaipur", "Lucknow", "Patna"]
            villages = ["Rampur", "Bhainsa", "Kukshi", "Barwani", "Dewas"]
            mobiles = [
                "9876543210", "9123456789", "8899776655", "9765432109", "9988776655",
                "9090909090", "8822446688", "7890123456", "9345678901", "9988123456"
            ]

            for i in range(10):
                # Ensure User exists or create
                user, _ = User.objects.get_or_create(
                    mobile=mobiles[i],
                    defaults={
                        "name": names[i],
                        "email": f"user{i}@example.com",
                        "password": passwords[i]
                    }
                )

                # Land
                land = Land.objects.create(
                    name=names[i],
                    state=states[i % len(states)],
                    district=districts[i % len(districts)],
                    village=villages[i % len(villages)],
                    mobile=mobiles[i],
                    LandSize=5 + i,
                    TotalRentPrice=15000 + (i * 1000),
                    RentPricePerAcre=3000 + (i * 100),
                    rentPeriod=6 + i,
                    irrigationSource="Canal",
                    extraFacilities="Water, Electricity",
                    AccName=names[i],
                    BankName="SBI",
                    AccNo=f"1234567890{i}",
                    IFSC="SBIN0001234",
                    map_location=f"loc_{i}"
                )

                # Labour
                labour = Labour.objects.create(
                    name=names[i],
                    mobile=mobiles[i],
                    selected_state=states[i % len(states)],
                    selected_district=districts[i % len(districts)],
                    selected_village=villages[i % len(villages)],
                    work_type="Harvesting",
                    price=500 + i * 10,
                    price_type="Per Day",
                    age=20 + i,
                    gender="Male" if i % 2 == 0 else "Female",
                    experience=1 + i
                )

                LabourBank.objects.create(
                    labour=labour,
                    bname=names[i],
                    bank_name="PNB",
                    b_account_no=f"9988776655{i}",
                    IFSC="PUNB0123456"
                )

                # Machine
                machine = Machine.objects.create(
                    owner_name=names[i],
                    mobile_no=mobiles[i],
                    state=states[i % len(states)],
                    district=districts[i % len(districts)],
                    village=villages[i % len(villages)],
                    machine_name="Tractor",
                    purpose="Ploughing",
                    specification="Heavy Duty",
                    with_tractor=True,
                    tractor_company="Mahindra",
                    tractor_model="575 DI XP Plus",
                    hiring_cost_acre=1000 + i * 100,
                    hiring_cost_hour=300 + i * 10,
                    quantity=2 + i
                )

                MachineAccount.objects.create(
                    machine=machine,
                    bname=names[i],
                    bank_name="BOB",
                    account_no=f"4455667788{i}",
                    ifsc="BARB0XYZ123"
                )

                today_date = timezone.now().date()
                today_str = today_date.strftime("%d-%m-%Y")

                # Land Request
                LandRequest.objects.create(
                    name=names[i],
                    sender_mobile=mobiles[i],
                    landSize=str(3 + i),
                    period_start=today_date,
                    period_end=today_date,
                    description="Looking for temporary lease",
                    receiver_mobile=mobiles[i],
                    status="pending",
                    request_date=today_str,
                    land_id=land.land_id,
                    preview_description="Short term",
                    request_price="5000",
                    preview_date=today_str
                )

                # Labour Request
                LabourRequest.objects.create(
                    receiver_mobile=mobiles[i],
                    name=names[i],
                    sender_mobile=mobiles[i],
                    workTime="8 hours",
                    workUnit="Day",
                    state=states[i % len(states)],
                    district=districts[i % len(districts)],
                    village=villages[i % len(villages)],
                    workType="Sowing",
                    otherWork="N/A",
                    description="Need help for sowing crop",
                    period_start=today_date,
                    period_end=today_date,
                    status="pending",
                    request_date=today_str,
                    preview_description="Sowing support",
                    request_price="400",
                    preview_date=today_str
                )

                # Machine Request
                MachineRequest.objects.create(
                    name=names[i],
                    sender_mobile=mobiles[i],
                    hour="4",
                    period_start=today_date,
                    period_end=today_date,
                    state=states[i % len(states)],
                    district=districts[i % len(districts)],
                    village=villages[i % len(villages)],
                    description="Need for 4 hours of ploughing",
                    status="pending",
                    machine_id=machine.id,
                    machine_name=machine.machine_name,
                    receiver_mobile=mobiles[i],
                    request_date=today_str,
                    preview_description="Urgent need",
                    request_price="1000",
                    preview_date=today_str
                )

            return JsonResponse({"message": "Dummy data inserted successfully!", "status": "success"}, status=201)
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)
