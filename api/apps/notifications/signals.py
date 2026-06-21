import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.hire_request.models import HireRequest
from apps.customer.models import Customer
from apps.employer.models import Employer
from .models import Notification

logger = logging.getLogger(__name__)

@receiver(post_save, sender=HireRequest)
def handle_hire_request_notifications(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        customer_email = instance.customer_email
        employer_email = instance.employer_email

        customer = Customer.objects.filter(email=customer_email).first()
        employer = Employer.objects.filter(email=employer_email).first()

        if customer and employer:
            Notification.objects.create(
                recipient_type="employer",
                recipient_id=employer.id,
                sender_type="customer",
                sender_id=customer.id,
                notification_type="HIRE_REQUEST",
                title="New Hire Request",
                message=f"{customer.fullname} wants to hire you.",
                reference_id=instance.id
            )
        else:
            logger.warning(
                "Could not create HIRE_REQUEST notification: Customer or Employer not found. "
                "Customer Email: %s, Employer Email: %s",
                customer_email, employer_email
            )
    except Exception as e:
        # Crucial requirement: Notification creation failures should not affect existing hire request workflows
        logger.exception("Notification creation failed on hire request creation signal: %s", e)
