from django.urls import path
from .views import create_customer, get_customers, get_customer_profile

urlpatterns = [
    path("register/", create_customer),
    path("list/", get_customers),
    path("profile/", get_customer_profile),
]