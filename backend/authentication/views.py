from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import json
import jwt
from datetime import datetime, timedelta
from .models import User

# Use secret key from settings if available, otherwise fallback
SECRET_KEY = getattr(settings, "JWT_SECRET_KEY", "Abhishek4852")

def get_token(user):
    payload = {
        "user_id": user.user_id,
        "name": user.name,
        "mobile": user.mobile,
        "email": user.email,
        "is_admin": getattr(user, "is_admin", False),
        "exp": datetime.utcnow() + timedelta(hours=12),
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

@csrf_exempt
def Registration(request):
    if request.method == 'POST':
        try:
            print("hello")
            data = json.loads(request.body)
            name = data.get('fname')
            mobile = data.get('fmobile')
            email = data.get('femail')
            password = data.get('fpass') 
            is_admin = data.get('is_admin', False)  # Enable admin registration option if sent

            if not all([name, mobile, email, password]):
                return JsonResponse({"status": "failure", "error": {"code": 400, "message": "All fields are required."}}, status=400)

            if User.objects.filter(mobile=mobile).exists():
                return JsonResponse({"status": "failure", "error": {"code": 400, "message": "User already exists with this mobile number."}}, status=400)

            encrypt_pass = make_password(password)
            user = User(name=name, mobile=mobile, email=email, password=encrypt_pass, is_admin=is_admin)
            user.save()
            return JsonResponse({"message": "Registered Successfully", "status": "success"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            login_id = data.get("fmobile") or data.get("email")
            password = data.get("fpass")

            if not login_id or not password:
                return JsonResponse({"message": "Mobile number/Email and password are required.", "status": "missing_fields"}, status=400)

            if "@" in str(login_id):
                user = User.objects.filter(email=login_id).first()
            else:
                user = User.objects.filter(mobile=login_id).first()

            if user:
                if check_password(password, user.password):
                    token = get_token(user)
                    return JsonResponse({
                        "message": "Login successful",
                        "token": token,
                        "status": "success",
                        "user": {
                            "name": user.name,
                            "email": user.email,
                            "mobile": user.mobile,
                            "is_admin": getattr(user, "is_admin", False)
                        }
                    }, status=200)
                else:
                    return JsonResponse({
                        "message": "Incorrect password",
                        "status": "wrong_password"
                    }, status=401)
            else:
                return JsonResponse({
                    "message": "User not found",
                    "status": "user_not_found"
                }, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def token_validation(request):
    if request.method == "POST":
        try:
            token_data = json.loads(request.body)
            token = token_data.get("token")
            if not token:
                return JsonResponse({"error": "Token is required"}, status=400)
                
            decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return JsonResponse(decoded_payload, status=200)
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=403)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
            
    return JsonResponse({"message": "something went wrong"}, status=400)
