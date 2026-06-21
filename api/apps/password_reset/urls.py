from django.urls import path
from .views import send_otp, verify_otp, reset_password

urlpatterns = [
    path("send-otp/", send_otp, name="send_otp"),
    path("verify-otp/", verify_otp, name="verify_otp"),
    path("reset-password/", reset_password, name="reset_password"),
]