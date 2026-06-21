from django.db import models

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ("HIRE_REQUEST", "Hire Request"),
        ("HIRE_ACCEPTED", "Hire Accepted"),
        ("HIRE_REJECTED", "Hire Rejected"),
    )
    
    recipient_type = models.CharField(max_length=20)  # "customer" or "employer"
    recipient_id = models.IntegerField()
    sender_type = models.CharField(max_length=20)  # "customer" or "employer"
    sender_id = models.IntegerField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=150)
    message = models.TextField()
    reference_id = models.IntegerField(null=True, blank=True)  # ID of the HireRequest
    is_read = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)  # Future-proofing notifications deletion
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} -> {self.recipient_type} (ID: {self.recipient_id})"
