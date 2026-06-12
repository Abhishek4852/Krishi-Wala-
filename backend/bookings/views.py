from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import json
import traceback
from datetime import datetime
import razorpay

from authentication.decorators import jwt_login_required
from .models import LabourRequest, LandRequest, MachineRequest, Payment
from .tasks import send_booking_notification_emails, send_approval_notification_emails, send_bank_details_reminder

@csrf_exempt
@jwt_login_required
def labour_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Labour Request Data:", data)
            current_date = datetime.now().strftime("%d-%m-%Y")

            receiver_mobile = data.get("receiver_mobile")
            sender_mobile = data.get("mobile") or request.user.mobile
            description = data.get("description", "")
            
            # Create request
            LabourRequest.objects.create(
                receiver_mobile=receiver_mobile,
                name=data.get("name") or request.user.name,
                sender_mobile=sender_mobile,
                workTime=data.get("workTime"),
                workUnit=data.get("workUnit"),
                state=data.get("workLocation", {}).get("state"),
                district=data.get("workLocation", {}).get("district"),
                village=data.get("workLocation", {}).get("village"),
                workType=data.get("workType"),
                otherWork=data.get("otherWork", ""),
                description=description,
                period_start=data.get("period", {}).get("start"),
                period_end=data.get("period", {}).get("end"),
                status=data.get("status", "pending"),
                request_date=current_date
            )

            # Trigger Celery Task to email both parties asynchronously
            send_booking_notification_emails.delay(
                sender_mobile=sender_mobile,
                receiver_mobile=receiver_mobile,
                description=description,
                request_type="Labour"
            )

            return JsonResponse({"message": "Request saved successfully", "status": "success"}, status=200)
        except Exception as e:
            print("Error in labour_request:", e)
            return JsonResponse({"error": "Failed to save data: " + str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@jwt_login_required
def land_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Land Request Data:", data)
            current_date = datetime.now().strftime("%d-%m-%Y")

            receiver_mobile = data.get("receiver_mobile")
            sender_mobile = data.get("sender_mobile") or request.user.mobile
            description = data.get("description", "")

            # Create request
            LandRequest.objects.create(
                name=data.get("name") or request.user.name,
                sender_mobile=sender_mobile,
                landSize=data.get("landSize"),
                period_start=data.get("rentingPeriod", {}).get("start"),
                period_end=data.get("rentingPeriod", {}).get("end"),
                description=description,
                receiver_mobile=receiver_mobile,
                status=data.get("status", "pending"),
                request_date=current_date,
                land_id=data.get("land_id")
            )

            # Trigger Celery Task to email both parties asynchronously
            send_booking_notification_emails.delay(
                sender_mobile=sender_mobile,
                receiver_mobile=receiver_mobile,
                description=description,
                request_type="Land Rent"
            )

            return JsonResponse({"message": "Request saved successfully", "status": "success"}, status=200)
        except Exception as e:
            print("Error in land_request:", e)
            return JsonResponse({"error": "Failed to save data: " + str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@jwt_login_required
def machine_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Machine Request Data:", data)
            current_date = datetime.now().strftime("%d-%m-%Y")

            machinedata = data.get("machinedata", {})
            receiver_mobile = machinedata.get("owner_mobile")
            sender_mobile = data.get("sender_mobile") or request.user.mobile
            description = data.get("description", "")

            # Create request
            MachineRequest.objects.create(
                name=data.get("name") or request.user.name,
                sender_mobile=sender_mobile,
                hour=data.get("hour"),
                period_start=data.get("rentingPeriod", {}).get("start"),
                period_end=data.get("rentingPeriod", {}).get("end"),
                state=data.get("location", {}).get("state"),
                district=data.get("location", {}).get("district"),
                village=data.get("location", {}).get("village"),
                description=description,
                status=data.get("status", "pending"),
                machine_id=machinedata.get("id"),
                machine_name=machinedata.get("machineName"),
                receiver_mobile=receiver_mobile,
                request_date=current_date
            )

            # Trigger Celery Task to email both parties asynchronously
            send_booking_notification_emails.delay(
                sender_mobile=sender_mobile,
                receiver_mobile=receiver_mobile,
                description=description,
                request_type="Machine Rent"
            )

            return JsonResponse({"message": "Machine request saved", "status": "success"}, status=200)
        except Exception as e:
            print("Error in machine_request:", e)
            return JsonResponse({"error": "Failed to process request: " + str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@jwt_login_required
def recieved_request(request):
    """
    Spelled 'recieved_request' for frontend compatibility.
    """
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            receiver_mobile = body.get("receiver_mobile") or request.user.mobile

            if not receiver_mobile:
                return JsonResponse({"error": "receiver_mobile is required"}, status=400)

            response_data = []

            # Land Requests
            land_requests = LandRequest.objects.filter(receiver_mobile=receiver_mobile)
            for req in land_requests:
                response_data.append({
                    "id": req.id,
                    "type": "Land Rent",
                    "receivedDate": req.request_date,
                    "recivere_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "landSize": req.landSize,
                        "description": req.description,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "status": req.status,
                        "land_id": req.land_id,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "preview_date": req.preview_date,
                    }
                })

            # Machine Requests
            machine_requests = MachineRequest.objects.filter(receiver_mobile=receiver_mobile)
            for req in machine_requests:
                response_data.append({
                    "id": req.id,
                    "type": "Machine Rent",
                    "receivedDate": req.request_date,
                    "recivere_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "hour": req.hour,
                        "description": req.description,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "machine_id": req.machine_id,
                        "machine_name": req.machine_name,
                        "status": req.status,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "preview_date": req.preview_date,
                    }
                })

            # Labour Requests
            labour_requests = LabourRequest.objects.filter(receiver_mobile=receiver_mobile)
            for req in labour_requests:
                response_data.append({
                    "id": req.id,
                    "type": "Labour",
                    "receivedDate": req.request_date,
                    "recivere_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "workTime": req.workTime,
                        "workUnit": req.workUnit,
                        "workType": req.workType,
                        "otherWork": req.otherWork,
                        "description": req.description,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "status": req.status,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "preview_date": req.preview_date,
                    }
                })

            return JsonResponse(response_data, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

@csrf_exempt
@jwt_login_required
def sent_request(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            sender_mobile = body.get("sender_mobile") or request.user.mobile

            if not sender_mobile:
                return JsonResponse({"error": "Sender mobile is required."}, status=400)

            data = []

            # Labour Requests
            labour_requests = LabourRequest.objects.filter(sender_mobile=sender_mobile)
            for req in labour_requests:
                data.append({
                    "id": req.id,
                    "type": "labour",
                    "sentDate": req.request_date,
                    "status": req.status,
                    "receiver_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "description": req.description,
                        "workTime": req.workTime,
                        "workUnit": req.workUnit,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "workType": req.workType,
                        "otherWork": req.otherWork,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "response_date": req.preview_date
                    }
                })

            # Land Requests
            land_requests = LandRequest.objects.filter(sender_mobile=sender_mobile)
            for req in land_requests:
                data.append({
                    "id": req.id,
                    "type": "land",
                    "sentDate": req.request_date,
                    "status": req.status,
                    "receiver_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "description": req.description,
                        "landSize": req.landSize,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "land_id": req.land_id,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "response_date": req.preview_date
                    }
                })

            # Machine Requests
            machine_requests = MachineRequest.objects.filter(sender_mobile=sender_mobile)
            for req in machine_requests:
                data.append({
                    "id": req.id,
                    "type": "machine",
                    "sentDate": req.request_date,
                    "status": req.status,
                    "receiver_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "description": req.description,
                        "hour": req.hour,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "machine_id": req.machine_id,
                        "machine_name": req.machine_name,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "response_date": req.preview_date
                    }
                })
           
            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

@csrf_exempt
@jwt_login_required
def preview_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Preview Request Data:", data)

            request_info = data['preview_request']
            request_type = request_info['type']
            receiver_mobile = request_info['recivere_mobile']
            request_id = request_info['id']

            # Fields to update
            new_status = data['preview_status']
            new_description = data['preview_description']
            new_price = data['preview_price']
            preview_date = datetime.now().strftime("%d-%m-%Y")

            # Choose model based on request type
            if request_type == "Land Rent":
                try:
                    target = LandRequest.objects.get(id=request_id, receiver_mobile=receiver_mobile)
                    target.status = new_status
                    target.preview_description = new_description
                    target.request_price = new_price
                    target.preview_date = preview_date
                    target.save()
                    if new_status == "approved":
                        send_approval_notification_emails.delay(target.sender_mobile, receiver_mobile, request_type)
                    return JsonResponse({"message": "Land request updated successfully", "status": "success"}, status=200)
                except LandRequest.DoesNotExist:
                    return JsonResponse({"error": "Land request not found"}, status=404)

            elif request_type == "Machine Rent":
                try:
                    target = MachineRequest.objects.get(id=request_id, receiver_mobile=receiver_mobile)
                    target.status = new_status
                    target.preview_description = new_description
                    target.request_price = new_price
                    target.preview_date = preview_date
                    target.save()
                    if new_status == "approved":
                        send_approval_notification_emails.delay(target.sender_mobile, receiver_mobile, request_type)
                    return JsonResponse({"message": "Machine request updated successfully", "status": "success"}, status=200)
                except MachineRequest.DoesNotExist:
                    return JsonResponse({"error": "Machine request not found"}, status=404)

            elif request_type == "Labour":
                try:
                    target = LabourRequest.objects.get(id=request_id, receiver_mobile=receiver_mobile)
                    target.status = new_status
                    target.preview_description = new_description
                    target.request_price = new_price
                    target.preview_date = preview_date
                    target.save()
                    if new_status == "approved":
                        send_approval_notification_emails.delay(target.sender_mobile, receiver_mobile, request_type)
                    return JsonResponse({"message": "Labour request updated successfully", "status": "success"}, status=200)
                except LabourRequest.DoesNotExist:
                    return JsonResponse({"error": "Labour request not found"}, status=404)

            else:
                return JsonResponse({"error": "Invalid request type"}, status=400)

        except Exception as e:
            return JsonResponse({"error": f"Something went wrong: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

@csrf_exempt
@jwt_login_required
def check_payment_readiness(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            sender_mobile = data.get("sender_mobile")
            receiver_mobile = data.get("receiver_mobile")

            if not sender_mobile or not receiver_mobile:
                return JsonResponse({"error": "Missing mobile numbers"}, status=400)

            from authentication.models import User
            sender = User.objects.filter(mobile=sender_mobile).first()
            receiver = User.objects.filter(mobile=receiver_mobile).first()

            if not sender or not receiver:
                return JsonResponse({"error": "Users not found"}, status=404)

            def has_bank_details(u):
                has_upi = bool(u.upi_id and u.upi_id.strip())
                has_bank = bool(u.acc_no and u.acc_no.strip() and u.ifsc and u.ifsc.strip())
                return has_upi or has_bank

            if not has_bank_details(receiver):
                send_bank_details_reminder.delay(receiver_mobile)
                return JsonResponse({"status": "error", "missing": "receiver", "message": "Owner has not updated their bank details. We have sent them an email to update it."}, status=200)

            if not has_bank_details(sender):
                return JsonResponse({"status": "error", "missing": "sender", "message": "Please update your bank details in your profile before making a payment."}, status=200)

            return JsonResponse({"status": "ready", "message": "Both parties have bank details."}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Error: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

@csrf_exempt
@jwt_login_required
def create_razorpay_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = data.get("amount")  # in INR
            request_id = data.get("request_id")
            request_type = data.get("request_type")  # Land Rent, Labour, Machine Rent
            
            if not all([amount, request_id, request_type]):
                return JsonResponse({"error": "Missing required fields"}, status=400)
                
            # Initialize Razorpay Client
            key_id = getattr(settings, "RAZORPAY_KEY_ID", "rzp_test_dummy_id")
            key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "dummy_secret")
            client = razorpay.Client(auth=(key_id, key_secret))
            
            # Create order
            order_data = {
                "amount": int(float(amount) * 100),  # in paise
                "currency": "INR",
                "receipt": f"receipt_req_{request_id}",
                "payment_capture": 1
            }
            order = client.order.create(data=order_data)
            
            # Save Payment record
            payment = Payment.objects.create(
                order_id=order["id"],
                amount=amount,
                status="created",
                request_type=request_type,
                request_id=request_id
            )
            
            return JsonResponse({
                "status": "success",
                "order_id": order["id"],
                "amount": amount,
                "key_id": key_id
            })
        except Exception as e:
            print("Error creating Razorpay order:", e)
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@jwt_login_required
def verify_razorpay_payment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            order_id = data.get("razorpay_order_id")
            payment_id = data.get("razorpay_payment_id")
            signature = data.get("razorpay_signature")
            
            if not all([order_id, payment_id, signature]):
                return JsonResponse({"error": "Missing signature verification fields"}, status=400)
                
            key_id = getattr(settings, "RAZORPAY_KEY_ID", "rzp_test_dummy_id")
            key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "dummy_secret")
            client = razorpay.Client(auth=(key_id, key_secret))
            
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            
            try:
                client.utility.verify_payment_signature(params_dict)
                # Successful verification
                payment = Payment.objects.filter(order_id=order_id).first()
                if payment:
                    payment.status = "paid"
                    payment.razorpay_payment_id = payment_id
                    payment.razorpay_signature = signature
                    payment.save()
                    
                    # Update status of target booking request
                    if payment.request_type == "Land Rent" or payment.request_type == "land":
                        req = LandRequest.objects.filter(id=payment.request_id).first()
                    elif payment.request_type == "Labour" or payment.request_type == "labour":
                        req = LabourRequest.objects.filter(id=payment.request_id).first()
                    elif payment.request_type == "Machine Rent" or payment.request_type == "machine":
                        req = MachineRequest.objects.filter(id=payment.request_id).first()
                    else:
                        req = None
                        
                    if req:
                        req.status = "paid"
                        req.save()
                        
                    return JsonResponse({"status": "success", "message": "Payment verified successfully!"})
                else:
                    return JsonResponse({"error": "Payment record not found"}, status=404)
            except Exception as sig_err:
                payment = Payment.objects.filter(order_id=order_id).first()
                if payment:
                    payment.status = "failed"
                    payment.save()
                return JsonResponse({"error": f"Signature verification failed: {str(sig_err)}"}, status=400)
                
        except Exception as e:
            print("Error verifying Razorpay payment:", e)
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
@jwt_login_required
def transaction_history(request):
    if request.method == "GET":
        try:
            user_mobile = request.user.mobile
            payments = Payment.objects.all().order_by('-created_at')
            history = []

            for payment in payments:
                req = None
                request_title = "Payment"

                if payment.request_type == "Land Rent" or payment.request_type == "land":
                    req = LandRequest.objects.filter(id=payment.request_id).first()
                    request_title = "Land Rent"
                elif payment.request_type == "Labour" or payment.request_type == "labour":
                    req = LabourRequest.objects.filter(id=payment.request_id).first()
                    request_title = "Labour Hire"
                elif payment.request_type == "Machine Rent" or payment.request_type == "machine":
                    req = MachineRequest.objects.filter(id=payment.request_id).first()
                    request_title = "Machine Rent"

                if req:
                    # Check if user is sender (debited) or receiver (credited)
                    if req.sender_mobile == user_mobile:
                        history.append({
                            "id": payment.payment_id,
                            "order_id": payment.order_id,
                            "amount": str(payment.amount),
                            "type": "Debited",
                            "status": payment.status,
                            "date": payment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                            "description": f"Paid for {request_title} (To: {req.receiver_mobile})"
                        })
                    elif req.receiver_mobile == user_mobile:
                        history.append({
                            "id": payment.payment_id,
                            "order_id": payment.order_id,
                            "amount": str(payment.amount),
                            "type": "Credited",
                            "status": payment.status,
                            "date": payment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                            "description": f"Received for {request_title} (From: {req.sender_mobile})"
                        })

            return JsonResponse({"status": "success", "transactions": history})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)
