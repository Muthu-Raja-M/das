from django.urls import path
from .views import (
    get_employee_notifications,
    get_customer_notifications,
    mark_notification_as_read,
    mark_all_notifications_as_read,
)

urlpatterns = [
    path("employee/", get_employee_notifications, name="employee_notifications"),
    path("customer/", get_customer_notifications, name="customer_notifications"),
    path("<int:notification_id>/read/", mark_notification_as_read, name="mark_notification_as_read"),
    path("read-all/", mark_all_notifications_as_read, name="mark_all_notifications_as_read"),
]
