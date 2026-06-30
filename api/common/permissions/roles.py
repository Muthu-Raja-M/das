from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Allows access only to administrator users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "admin"
        )


class IsCustomerUser(BasePermission):
    """
    Allows access only to customer users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "customer"
        )


class IsEmployerUser(BasePermission):
    """
    Allows access only to employer users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "employer"
        )
