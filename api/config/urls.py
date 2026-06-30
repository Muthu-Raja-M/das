from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/employer/", include("apps.employer.urls")),
    path("api/verification/", include("apps.verification.urls")),
    path("api/customer/", include("apps.customer.urls")),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/hirerequest/", include("apps.hire_request.urls")),
    path("api/passwordreset/", include("apps.password_reset.urls")), 
    path("api/messages/", include("apps.messaging.urls")),
    path("api/adminpanel/", include("apps.adminpanel.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/reviews/", include("apps.reviews.urls"))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)