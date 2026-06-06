import jwt
from functools import wraps
from django.http import JsonResponse
from django.conf import settings
from .models import User

def jwt_login_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        # 1. Try to read from Authorization header
        auth_header = request.headers.get('Authorization', None)
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        # 2. Try to read from query parameters
        if not token:
            token = request.GET.get('token')
            
        # 3. Try to read from request POST parameters
        if not token and request.method == 'POST':
            token = request.POST.get('token')
            
        # 4. Try to read from JSON body
        if not token:
            if request.content_type == 'application/json':
                try:
                    import json
                    body_data = json.loads(request.body)
                    token = body_data.get('token')
                except Exception:
                    pass
        
        if not token:
            return JsonResponse({"error": "Authentication token required"}, status=401)
        
        try:
            secret = getattr(settings, "JWT_SECRET_KEY", "Abhishek4852")
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            user_id = payload.get("user_id")
            user = User.objects.filter(user_id=user_id).first()
            if not user:
                return JsonResponse({"error": "User not found"}, status=401)
            request.user = user
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)
        
        return view_func(request, *args, **kwargs)
    return wrapped_view

def jwt_admin_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        if not token:
            token = request.GET.get('token')
        if not token and request.method == 'POST':
            token = request.POST.get('token')
        if not token:
            if request.content_type == 'application/json':
                try:
                    import json
                    body_data = json.loads(request.body)
                    token = body_data.get('token')
                except Exception:
                    pass
        if not token:
            return JsonResponse({"error": "Authentication token required"}, status=401)
        
        try:
            secret = getattr(settings, "JWT_SECRET_KEY", "Abhishek4852")
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            user_id = payload.get("user_id")
            user = User.objects.filter(user_id=user_id).first()
            if not user:
                return JsonResponse({"error": "User not found"}, status=401)
            if not getattr(user, 'is_admin', False):
                return JsonResponse({"error": "Admin role required"}, status=403)
            request.user = user
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)
        
        return view_func(request, *args, **kwargs)
    return wrapped_view
