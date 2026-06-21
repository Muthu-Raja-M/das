from django.db import models


class ChatMessage(models.Model):
    sender_email = models.EmailField()
    receiver_email = models.EmailField()
    hire_request = models.ForeignKey(
        "hire_request.HireRequest",
        on_delete=models.CASCADE,
        related_name="messages"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender_email} -> {self.receiver_email}"