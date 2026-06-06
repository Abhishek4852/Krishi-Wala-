from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Q
import json
import traceback

from listings.models import Land, LandPhotos, Machine, Labour

@csrf_exempt
def filter_land(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)
    try:
        data = json.loads(request.body)
        print("Filtering Land Data:", data)
        selected_state = data.get("selectedState", "")
        selected_district = data.get("selectedDistrict", "")
        selected_village = data.get("selectedVillage", "")
        size = data.get("size", None)
        price_per_acre = data.get("pricePerAcre", None)
        period = data.get("period", None)
        irrigation_sources = data.get("irrigationSource", [])

        # Step 1: Filter by State
        land_records = Land.objects.filter(state=selected_state)

        # Step 2: If more than 6 records, filter by District
        if land_records.count() > 6 and selected_district:
            land_records = land_records.filter(district=selected_district)

        # Step 3: If more than 6 records, filter by Village
        if land_records.count() > 6 and selected_village:
            land_records = land_records.filter(village=selected_village)

        # Step 4: If more than 6 records, apply size filter with 40% tolerance
        if land_records.count() > 6 and size is not None:
            min_size = float(size) * 0.6
            max_size = float(size) * 1.4
            land_records = land_records.filter(LandSize__gte=min_size, LandSize__lte=max_size)

        # Step 5: If more than 6 records, apply price filter with 40% tolerance
        if land_records.count() > 6 and price_per_acre is not None:
            min_price = float(price_per_acre) * 0.6
            max_price = float(price_per_acre) * 1.4
            land_records = land_records.filter(RentPricePerAcre__gte=min_price, RentPricePerAcre__lte=max_price)

        # Step 6: If more than 6 records, apply period filter with 40% tolerance
        if land_records.count() > 6 and period is not None:
            min_period = float(period) * 0.6
            max_period = float(period) * 1.4
            land_records = land_records.filter(rentPeriod__gte=min_period, rentPeriod__lte=max_period)

        # Step 7: If more than 6 records, apply irrigation source filter
        if land_records.count() > 6 and isinstance(irrigation_sources, list) and irrigation_sources:
            irrigation_query = Q()
            for source in irrigation_sources:
                irrigation_query |= Q(irrigationSource__icontains=source.strip())
            land_records = land_records.filter(irrigation_query)

        # Prepare the response data
        response_data = []
        for land in land_records:
            images = LandPhotos.objects.filter(land_id=land)
            image_path_list = [image.image.url for image in images]

            response_data.append({
                "land_id": land.land_id,
                "name": land.name,
                "owner_mobile": land.mobile,
                "state": land.state,
                "district": land.district,
                "village": land.village,
                "mobile": land.mobile,
                "LandSize": land.LandSize,
                "TotalRentPrice": land.TotalRentPrice,
                "RentPricePerAcre": land.RentPricePerAcre,
                "rentPeriod": land.rentPeriod,
                "irrigationSource": land.irrigationSource,
                "extraFacilities": land.extraFacilities,
                "AccName": land.AccName,
                "BankName": land.BankName,
                "AccNo": land.AccNo,
                "IFSC": land.IFSC,
                "map_location": land.map_location,
                "images": image_path_list
            })
        
        return JsonResponse(response_data, status=200, safe=False)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def search_machine(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)
        
    try:
        data = json.loads(request.body)
        selected_state = data.get("selectedState")
        selected_district = data.get("selectedDistrict")
        selected_village = data.get("selectedVillage")
        machine_purpose = data.get("machinePurpose")
        machine_name = data.get("machineName")
        with_tractor = data.get("withTractor")
        tractor_brand = data.get("tractorBrand")
        tractor_model = data.get("tractorModel")

        # Step 1: Filter by state
        machines = Machine.objects.filter(state=selected_state)

        # Step 2: If more than 6 machines, filter by district
        if machines.count() > 6 and selected_district:
            machines = machines.filter(district=selected_district)

        # Step 3: If more than 6, filter by village
        if machines.count() > 6 and selected_village:
            machines = machines.filter(village=selected_village)

        # Step 4: If more than 6, filter by machine purpose
        if machines.count() > 6 and machine_purpose:
            machines = machines.filter(purpose=machine_purpose)

        # Step 5: If more than 6, filter by machine name
        if machines.count() > 6 and machine_name:
            machines = machines.filter(machine_name=machine_name)

        # Step 6: If more than 6, filter by withTractor
        if machines.count() > 6 and with_tractor is not None:
            machines = machines.filter(with_tractor=with_tractor)

        # Step 7: If more than 6, filter by tractor brand and model
        if machines.count() > 6 and tractor_brand:
            machines = machines.filter(tractor_company=tractor_brand)
        if machines.count() > 6 and tractor_model:
            machines = machines.filter(tractor_model=tractor_model)

        # Prepare response
        response_data = []
        for machine in machines:
            response_data.append({
                "id": machine.id,
                "owner_mobile": machine.mobile_no,
                "machineName": machine.machine_name,
                "machinePurpose": machine.purpose,
                "withTractor": machine.with_tractor,
                "tractorBrand": machine.tractor_company if machine.tractor_company else "",
                "tractorModel": machine.tractor_model if machine.tractor_model else "",
                "hiringCostPerAcre": machine.hiring_cost_acre,
                "hiringCostPerHour": machine.hiring_cost_hour,
                "location": {
                    "state": machine.state,
                    "district": machine.district,
                    "village": machine.village,
                },
                "machinePhotos": [
                    image.image.url for image in machine.images.all()
                ],
            })
       
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def search_labour(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body)
        selected_state = data.get("selectedState")
        selected_district = data.get("selectedDistrict")
        selected_village = data.get("selectedVillage")
        work_type = data.get("workType")
        experience = data.get("minimumExp")
        wage_per_day = data.get("wagePerDay")
        wage_per_hour = data.get("wagePerHour")

        # Start with filtering by state
        query = Labour.objects.filter(selected_state=selected_state)
        
        # Apply filters step by step if records > 6
        if query.count() > 6:
            query = query.filter(selected_district=selected_district)
        
        if query.count() > 6:
            query = query.filter(selected_village=selected_village)
        
        if query.count() > 6 and work_type:
            query = query.filter(work_type=work_type)
        
        if query.count() > 6 and experience:
            query = query.filter(experience__gte=int(experience))
        
        if query.count() > 6 and wage_per_day:
            query = query.filter(price_type="Per Day", price__lte=float(wage_per_day))
        
        if query.count() > 6 and wage_per_hour:
            query = query.filter(price_type="Per Hour", price__lte=float(wage_per_hour))

        # Convert query results to JSON format
        labour_list = [
            {
                "id": labour.id,
                "name": labour.name,
                "owner_mobile": labour.mobile,
                "labourType": labour.work_type,
                "experience": f"{labour.experience} years",
                "dailyWage": float(labour.price),
                "availability": True,
                "location": {
                    "state": labour.selected_state,
                    "district": labour.selected_district,
                    "village": labour.selected_village,
                },
                "profilePhoto": labour.avatar.url if labour.avatar else "default.jpg",
            }
            for labour in query
        ]
        return JsonResponse({"labourListings": labour_list}, status=200)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)
