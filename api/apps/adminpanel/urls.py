from django.urls import path
from .views import (
    get_all_customers,
    get_all_employers,
    delete_customer,
    dashboard_stats,
)

urlpatterns = [
    path("customers/", get_all_customers, name="get_all_customers"),
    path("employers/", get_all_employers, name="get_all_employers"),
    path("customers/<int:customer_id>/delete/", delete_customer, name="delete_customer"),
    path("stats/", dashboard_stats, name="dashboard_stats"),
]