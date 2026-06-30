import logging
from rest_framework.permissions import BasePermission
from django.db.models import Q

logger = logging.getLogger(__name__)

class IsProfileOwner(BasePermission):
    """
    Checks if the email passed in the query params or payload matches request.user.email.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        email_param = (
            request.GET.get("email") or
            request.data.get("email") or
            request.GET.get("customer_email") or
            request.data.get("customer_email") or
            request.GET.get("employer_email") or
            request.data.get("employer_email")
        )
        if not email_param:
            return False
            
        is_owner = request.user.email.strip().lower() == email_param.strip().lower()
        if not is_owner:
            logger.warning(
                "Security Audit Alert: User %s attempted to access profile of %s",
                request.user.email,
                email_param
            )
        return is_owner


class IsHireRequestEmployer(BasePermission):
    """
    Checks if the authenticated employer user is the assigned employer for the HireRequest.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        request_id = view.kwargs.get("request_id")
        if not request_id:
            return False
            
        # Standard imports inside to avoid circular reference issues
        from apps.hire_request.models import HireRequest
        try:
            hire_request = HireRequest.objects.get(id=request_id)
            is_employer = (
                request.user.role == "employer" and
                hire_request.employer_email.strip().lower() == request.user.email.strip().lower()
            )
            if not is_employer:
                logger.warning(
                    "Security Audit Alert: User %s attempted to perform action on HireRequest %s owned by %s",
                    request.user.email,
                    request_id,
                    hire_request.employer_email
                )
            return is_employer
        except HireRequest.DoesNotExist:
            return False


class IsMessageSenderAndParticipant(BasePermission):
    """
    Validates sender_email matches request.user.email and ensures the user is a participant
    (customer or employer) of the underlying HireRequest transaction.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        sender_email = request.data.get("sender_email")
        if not sender_email or request.user.email.strip().lower() != sender_email.strip().lower():
            logger.warning(
                "Security Audit Alert: Sender email impersonation! Auth user: %s, payload sender: %s",
                request.user.email,
                sender_email
            )
            return False
            
        hire_request_id = request.data.get("hire_request_id")
        if not hire_request_id:
            return False
            
        from apps.hire_request.models import HireRequest
        try:
            hire_request = HireRequest.objects.get(id=hire_request_id)
            user_email = request.user.email.strip().lower()
            is_participant = user_email in [
                hire_request.customer_email.strip().lower(),
                hire_request.employer_email.strip().lower()
            ]
            if not is_participant:
                logger.warning(
                    "Security Audit Alert: User %s attempted to send chat message for HireRequest %s without being a participant",
                    request.user.email,
                    hire_request_id
                )
            return is_participant
        except HireRequest.DoesNotExist:
            return False


class IsConversationParticipant(BasePermission):
    """
    Verifies that request.user.email is either the customer or employer associated with the conversation's HireRequest.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.role == "admin":
            return True
            
        hire_request_id = view.kwargs.get("hire_request_id")
        if not hire_request_id:
            return False
            
        from apps.hire_request.models import HireRequest
        try:
            hire_request = HireRequest.objects.get(id=hire_request_id)
            user_email = request.user.email.strip().lower()
            is_participant = user_email in [
                hire_request.customer_email.strip().lower(),
                hire_request.employer_email.strip().lower()
            ]
            if not is_participant:
                logger.warning(
                    "Security Audit Alert: User %s attempted to view conversation for HireRequest %s without permission",
                    request.user.email,
                    hire_request_id
                )
            return is_participant
        except HireRequest.DoesNotExist:
            return False


class IsProfileOwnerOrAdmin(BasePermission):
    """
    Allows access if the user is the profile owner OR is an admin.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == "admin":
            return True
        return IsProfileOwner().has_permission(request, view)


class IsHireRequestEmployerOrAdmin(BasePermission):
    """
    Allows access if the user is the employer associated with the HireRequest OR is an admin.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == "admin":
            return True
        return IsHireRequestEmployer().has_permission(request, view)

