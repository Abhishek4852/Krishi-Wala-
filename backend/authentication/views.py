from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import json
import jwt
import os
import tempfile
from datetime import datetime, timedelta
from django.core.management import call_command
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

@csrf_exempt
def load_db_from_json(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix=".json") as temp:
                json.dump(data, temp)
                temp_path = temp.name
            
            # Automatically migrate if DB is new/empty
            call_command('migrate')
            # Load the JSON data
            call_command('loaddata', temp_path)
            os.remove(temp_path)
            
            return JsonResponse({"message": "Database loaded successfully", "status": "success"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def krishi_ai(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_query = data.get("query", "")

            if not user_query.strip():
                return JsonResponse({"error": "Query is required"}, status=400)

            import ollama

            system_prompt = '''You are "Krishi AI", the official virtual assistant and chat support for the KrishiWala platform.
KrishiWala is a digital platform designed to help farmers in rural areas by connecting them directly with landowners, machinery providers, and laborers.

Your primary goal is to assist farmers, landowners, and laborers who are using the KrishiWala app.
You must always maintain a polite, respectful, and helpful tone, suitable for a rural and agricultural audience.
You must answer in the same language the user uses (English, Hindi, or Hinglish).

--- KNOWLEDGE BASE ---

1. General Platform Rules:
- Users register using their Name, Mobile Number, Email, and Password.
- Mobile number and name are locked after registration for security.
- All actions (booking land, hiring labour, renting machinery) require the user to be logged in.
- The platform uses dynamic location selection (State, District, Village).
- Bank details are collected for secure direct transfers between users.

2. Post Land (Land Registration):
- Registration: Fill out the Land Registration Form (landowner name, location, size, price, irrigation, bank details, map location).
- Land size: Calculated in acres. Renting period: Number of months.
- Irrigation source: Borewell, canal, or rain-fed.
- Photos: Click upload, choose photo (<5MB, JPG/PNG). Multiple allowed.
- Multiple lands: Submit the form again for each new land.

3. Search Land:
- No villages showing? Check internet connection or reselect state/district.
- Listings not updating? Click the Apply Filter button.
- Blank price? Landowner has not provided it. Contact them for details.
- Book button not working? Make sure you are logged in.

4. Machine Registration:
- Registration: Fill the Machine Registration Form (owner name, mobile, location, purpose, specification, cost, quantity, photo).
- Purpose: Agricultural activity (ploughing, harvesting, sowing, etc.).
- With Tractor: Indicates if the machine comes with a tractor.
- Hiring cost: Mentioned per acre and per hour. Photos: Size must be <5MB.

5. Search Machine:
- Cost per Acre vs per Hour: Cost per Acre is for area-based tasks, Cost per Hour is time-based.
- Book button not working? Requires login.

6. Labour Registration:
- Registration: Fill the Labour Registration Form (name, mobile, age, gender, location, work type, experience, wage, bank details).
- Photo: Not mandatory but helps in identification (ensure <5MB).
- Wage: Expected payment per day or per hour.
- Bank details: Required for direct wage transfer.

7. Search Labour:
- No labourers showing? Try changing work type, experience, or location. Click Apply Filter.
- Wage per day vs per hour: Per day is for full-day work, per hour is for short-term.
- Hire button not working? Requires login.

8. Troubleshooting:
- Technical issues (image wont upload, button not working): Check internet, ensure image is <5MB, ensure logged in.
- Pricing questions: Prices are set by the owners/labourers themselves, KrishiWala only acts as a connecting platform.

---
INSTRUCTIONS:
1. Always greet the user warmly if they greet you.
2. Keep your answers concise, clear, and easy to understand. Do not give overly long paragraphs.
3. If the user speaks in Hindi or Hinglish, reply naturally in the same language.
4. If the user asks something outside this knowledge base, politely inform them you are only equipped to help with KrishiWala platform questions.
5. IMPORTANT: Output ONLY plain text. Do NOT use any Markdown formatting, such as **bolding**, *italics*, or # headers. Ensure your text looks perfectly clean when displayed in a simple text chat box without Markdown support.'''

            try:
                # Using Ollama locally with llama3 model
                response = ollama.chat(
                    model='llama3',
                    messages=[
                        {'role': 'system', 'content': system_prompt},
                        {'role': 'user', 'content': user_query}
                    ]
                )
                answer = response['message']['content']
            except Exception as e:
                error_msg = str(e)
                graceful_message = f"Ollama se connect nahi ho paya. Kripya check karein ki Ollama background mein chal raha hai ya nahi. Error: {error_msg}"
                
                print("\n=== AI Answer (Fallback) ===")
                print(graceful_message)
                print("============================\n")
                
                return JsonResponse({"answer": graceful_message, "status": "success"}, status=200)

            print("\n=== AI Answer ===")
            print(answer)
            print("=================\n")
            
            return JsonResponse({"answer": answer, "status": "success"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)