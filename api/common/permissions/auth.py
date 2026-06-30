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
                pass
        elif role == "employer":
            try:
                user_obj = Employer.objects.get(id=user_id)
            except Employer.DoesNotExist:
                pass
        elif role == "admin":
            try:
                user_obj = User.objects.get(id=user_id)
            except User.DoesNotExist:
                pass

        # Robust secure fallback: If user_obj was not resolved or role is missing,
        # lookup using the globally unique email address to resolve role and user object.
        if user_obj is None and email:
            # 1. Try Customer
            try:
                user_obj = Customer.objects.get(email=email)
                role = "customer"
            except Customer.DoesNotExist:
                # 2. Try Employer
                try:
                    user_obj = Employer.objects.get(email=email)
                    role = "employer"
                except Employer.DoesNotExist:
                    # 3. Try Admin
                    try:
                        user_obj = User.objects.get(email=email)
                        role = "admin"
                    except User.DoesNotExist:
                        return None

        if user_obj is None:
            return None

        return (AuthenticatedUser(user_obj, role, email), validated_token)
