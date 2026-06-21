from django.db import models
from apps.employer.models import Employer


class EmployerVerification(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    employer = models.OneToOneField(
        Employer,
        on_delete=models.CASCADE,
        related_name="verification"
    )

    face_image = models.ImageField(upload_to="verification/face/", null=True, blank=True)
    aadhar_image = models.ImageField(upload_to="verification/aadhar/", null=True, blank=True)
    pan_image = models.ImageField(upload_to="verification/pan/", null=True, blank=True)
    driving_licence_image = models.ImageField(upload_to="verification/licence/", null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    admin_notes = models.TextField(blank=True, null=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    employer_unique_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    is_alert_read = models.BooleanField(default=False)
    is_alert_removed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.employer.username} - {self.status}"