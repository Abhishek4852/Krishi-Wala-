from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import User

@shared_task
def send_booking_notification_emails(sender_mobile, receiver_mobile, description, request_type):
    try:
        # Fetch sender and receiver from User model
        sender = User.objects.filter(mobile=sender_mobile).first()
        receiver = User.objects.filter(mobile=receiver_mobile).first()
        
        sender_name = sender.name if sender else "A User"
        receiver_name = receiver.name if receiver else "A User"
        
        sender_email = sender.email if sender else None
        receiver_email = receiver.email if receiver else None
        
        # Determine sender's role context for message
        sender_role = "User"
        if request_type == "Land Rent":
            sender_role = "Tenant"
        elif request_type == "Labour":
            sender_role = "Employer"
        elif request_type == "Machine Rent":
            sender_role = "Hirer"

        # Email for the receiver (notifying them of the new request)
        if receiver_email:
            receiver_subject = f"New Request Received on KrishiWala"
            receiver_body = (
                f"Hi {receiver_name},\n\n"
                f"Hey, you got a request from {sender_name} ({sender_role}).\n\n"
                f"Message details:\n"
                f"----------------------------------------\n"
                f"{description or 'No message description provided.'}\n"
                f"----------------------------------------\n\n"
                f"Please log in to KrishiWala to accept or manage this request.\n\n"
                f"Regards,\n"
                f"Team KrishiWala"
            )
            send_mail(
                subject=receiver_subject,
                message=receiver_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[receiver_email],
                fail_silently=True
            )

        # Email for the sender (confirmation of booking request sent)
        if sender_email:
            sender_subject = f"Request Sent Successfully - KrishiWala"
            sender_body = (
                f"Hi {sender_name},\n\n"
                f"Your request for {request_type} has been successfully sent to the owner ({receiver_name}).\n\n"
                f"We will notify you once they respond.\n\n"
                f"Regards,\n"
                f"Team KrishiWala"
            )
            send_mail(
                subject=sender_subject,
                message=sender_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[sender_email],
                fail_silently=True
            )
            
        return f"Emails sent successfully. Sender: {sender_email}, Receiver: {receiver_email}"
    except Exception as e:
        return f"Error sending emails: {str(e)}"
