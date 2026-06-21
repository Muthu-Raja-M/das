from django.urls import path
from .views import (
    send_message,
    get_conversation,
    get_employer_message_threads,
    get_customer_message_threads,
    get_customer_messages,
)

urlpatterns = [
    path("send/", send_message, name="send_message"),
    path("conversation/<int:hire_request_id>/", get_conversation, name="get_conversation"),
    path("employer-threads/", get_employer_message_threads, name="get_employer_message_threads"),
    path("customer-threads/", get_customer_message_threads, name="get_customer_message_threads"),
    path("customer-messages/", get_customer_messages, name="get_customer_messages"),
]