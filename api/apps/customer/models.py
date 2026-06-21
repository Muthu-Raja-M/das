from django.db import models

class Customer(models.Model):
    fullname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    aadhaar = models.CharField(max_length=12)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, default="customer")

    is_verified = models.BooleanField(default=False)
    verification_status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )

    def __str__(self):
        return self.fullname