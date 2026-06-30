from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from apps.customer.models import Customer
from apps.employer.models import Employer
from django.contrib.auth.models import User

class AuthenticatedUser:
    def __init__(self, user_obj, role, email):
        self.user_obj = user_obj
        self.role = role
        self.email = email
        self.id = user_obj.id

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def pk(self):
        return self.id


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except (InvalidToken, TokenError):
            return None

        user_id = validated_token.get("user_id")
        role = validated_token.get("role")
        email = validated_token.get("email")

        user_obj = None
        if role == "customer":
            try:
                user_obj = Customer.objects.get(id=user_id)
            except Customer.DoesNotExist:
                return None
        elif role == "employer":
            try:
                user_obj = Employer.objects.get(id=user_id)
            except Employer.DoesNotExist:
                return None
        elif role == "admin":
            try:
                user_obj = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return None
        else:
            return None

        return (AuthenticatedUser(user_obj, role, email), validated_token)
