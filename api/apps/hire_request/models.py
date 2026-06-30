from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import random


class HireRequest(models.Model):
    customer_email = models.EmailField()
    employer_email = models.EmailField()
    job_role = models.CharField(max_length=100)
    message = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_email} → {self.employer_email}"


class JobProgress(models.Model):
    hire_request = models.OneToOneField(HireRequest, on_delete=models.CASCADE, related_name="progress")
    step = models.IntegerField(default=1)  # 1: Work Accepted, 2: Location Arrived, 3: Work Completed, 4: Payment Completed

    # Timestamps for synchronization
    accepted_at = models.DateTimeField(auto_now_add=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    # Reached Location OTP validation
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_status = models.CharField(
        max_length=20,
        choices=[
            ("generated", "Generated"),
            ("verified", "Verified"),
            ("expired", "Expired")
        ],
        default="generated"
    )

    # Payment details
    payment_amount = models.IntegerField(default=0)
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("paid", "Paid")
        ],
        default="pending"
    )
    payment_method = models.CharField(max_length=50, default="Online")

    def __str__(self):
        return f"Progress for Hire Request {self.hire_request_id} - Step {self.step}"


@receiver(post_save, sender=HireRequest)
def create_job_progress(sender, instance, created, **kwargs):
    if instance.status == "accepted":
        # Create JobProgress if it does not exist already
        if not hasattr(instance, "progress"):
            otp_code = f"{random.randint(100000, 999999)}"
            JobProgress.objects.create(
                hire_request=instance,
                otp=otp_code,
                otp_status="generated"
            )