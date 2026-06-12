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
        size = data.get("size")
        price_per_acre = data.get("pricePerAcre")
        period = data.get("period")
        irrigation_sources = data.get("irrigationSource", [])

        land_records = Land.objects.all()

        is_filtered = any([selected_state, selected_district, selected_village, size, price_per_acre, period, irrigation_sources])

        if not is_filtered:
            land_records = land_records.order_by('?')[:50]
        else:
            if size not in [None, "", 0, "0"]:
                try:
                    min_size = float(size) * 0.6
                    max_size = float(size) * 1.4
                    land_records = land_records.filter(LandSize__gte=min_size, LandSize__lte=max_size)
                except ValueError:
                    pass

            if price_per_acre not in [None, "", 0, "0"]:
                try:
                    min_price = float(price_per_acre) * 0.6
                    max_price = float(price_per_acre) * 1.4
                    land_records = land_records.filter(RentPricePerAcre__gte=min_price, RentPricePerAcre__lte=max_price)
                except ValueError:
                    pass

            if period not in [None, "", 0, "0"]:
                try:
                    min_period = float(period) * 0.6
                    max_period = float(period) * 1.4
                    land_records = land_records.filter(rentPeriod__gte=min_period, rentPeriod__lte=max_period)
                except ValueError:
                    pass

            if isinstance(irrigation_sources, list) and irrigation_sources:
                irrigation_query = Q()
                for source in irrigation_sources:
                    if source.strip():
                        irrigation_query |= Q(irrigationSource__icontains=source.strip())
                if irrigation_query:
                    land_records = land_records.filter(irrigation_query)

            if selected_state:
                land_records = land_records.filter(state=selected_state)
            if land_records.count() > 50 and selected_district:
                land_records = land_records.filter(district=selected_district)
            if land_records.count() > 50 and selected_village:
                land_records = land_records.filter(village=selected_village)

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
        
        print("LAND RECORDS LENGTH:", len(response_data)); return JsonResponse(response_data, status=200, safe=False)

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def search_machine(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)
        
    try:
        data = json.loads(request.body)
        selected_state = data.get("selectedState", "")
        selected_district = data.get("selectedDistrict", "")
        selected_village = data.get("selectedVillage", "")
        machine_purpose = data.get("machinePurpose", "")
        machine_name = data.get("machineName", "")
        with_tractor = data.get("withTractor")
        tractor_brand = data.get("tractorBrand", "")
        tractor_model = data.get("tractorModel", "")
        hiring_cost_acre = data.get("hiringCostPerAcre")
        hiring_cost_hour = data.get("hiringCostPerHour")

        machines = Machine.objects.all()

        is_filtered = any([selected_state, selected_district, selected_village, machine_purpose, machine_name, with_tractor is not None, tractor_brand, tractor_model])

        if not is_filtered:
            machines = machines.order_by('?')[:50]
        else:
            if machine_purpose:
                machines = machines.filter(purpose=machine_purpose)
            if machine_name:
                machines = machines.filter(machine_name=machine_name)
            if with_tractor: # Only filter if true, as false means user didn't check the box
                machines = machines.filter(with_tractor=with_tractor)
            if tractor_brand:
                machines = machines.filter(tractor_company=tractor_brand)
            if tractor_model:
                machines = machines.filter(tractor_model=tractor_model)
            if hiring_cost_acre not in [None, "", 0, "0"]:
                try:
                    machines = machines.filter(hiring_cost_acre__lte=float(hiring_cost_acre))
                except ValueError:
                    pass
            if hiring_cost_hour not in [None, "", 0, "0"]:
                try:
                    machines = machines.filter(hiring_cost_hour__lte=float(hiring_cost_hour))
                except ValueError:
                    pass

            if selected_state:
                machines = machines.filter(state=selected_state)
            if machines.count() > 50 and selected_district:
                machines = machines.filter(district=selected_district)
            if machines.count() > 50 and selected_village:
                machines = machines.filter(village=selected_village)

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
        selected_state = data.get("selectedState", "")
        selected_district = data.get("selectedDistrict", "")
        selected_village = data.get("selectedVillage", "")
        work_type = data.get("workType", "")
        experience = data.get("minimumExp", None)
        wage_per_day = data.get("wagePerDay", None)
        wage_per_hour = data.get("wagePerHour", None)

        query = Labour.objects.all()
        
        is_filtered = any([selected_state, selected_district, selected_village, work_type, experience, wage_per_day, wage_per_hour])
        
        if not is_filtered:
            query = query.order_by('?')[:50]
        else:
            if work_type:
                query = query.filter(work_type=work_type)
            if experience not in [None, "", 0, "0"]:
                try:
                    query = query.filter(experience__gte=int(experience))
                except ValueError:
                    pass
            if wage_per_day not in [None, "", 0, "0"]:
                try:
                    query = query.filter(price_type="Per Day", price__lte=float(wage_per_day))
                except ValueError:
                    pass
            if wage_per_hour not in [None, "", 0, "0"]:
                try:
                    query = query.filter(price_type="Per Hour", price__lte=float(wage_per_hour))
                except ValueError:
                    pass
                
            if selected_state:
                query = query.filter(selected_state=selected_state)
            if query.count() > 50 and selected_district:
                query = query.filter(selected_district=selected_district)
            if query.count() > 50 and selected_village:
                query = query.filter(selected_village=selected_village)

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
