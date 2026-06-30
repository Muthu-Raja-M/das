from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from common.permissions.auth import CustomJWTAuthentication
from django.db import transaction
from django.db.models import Avg, Count
from django.utils import timezone
import logging

from apps.hire_request.models import HireRequest, JobProgress
from apps.customer.models import Customer
from apps.employer.models import Employer
from apps.notifications.models import Notification
from .models import JobReview
from .serializers import JobReviewSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def submit_customer_review(request):
    """
    Employer reviews Customer.
    """
    if request.user.role != "employer":
        return Response({"error": "Only employers can review customers."}, status=status.HTTP_403_FORBIDDEN)

    hire_request_id = request.data.get("hire_request_id")
    if not hire_request_id:
        return Response({"error": "hire_request_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        hire_request = HireRequest.objects.get(id=hire_request_id)
        if hire_request.employer_email.strip().lower() != request.user.email.strip().lower():
            logger.warning("Security Audit Alert: User %s attempted to review customer for HireRequest %s which is assigned to another employer", request.user.email, hire_request_id)
            return Response({"error": "You are not authorized to review this job."}, status=status.HTTP_403_FORBIDDEN)

        if hire_request.status not in ["completed", "fully_reviewed"]:
            return Response({"error": "Reviews are only allowed after payment is completed."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already reviewed
        if JobReview.objects.filter(hire_request=hire_request, reviewer_role="employer").exists():
            return Response({"error": "You have already submitted a review for this job."}, status=status.HTTP_400_BAD_REQUEST)

        customer = Customer.objects.get(email=hire_request.customer_email)
        employer = Employer.objects.get(email=hire_request.employer_email)

        overall_rating = int(request.data.get("overall_rating", 5))
        communication = request.data.get("communication")
        behaviour = request.data.get("behaviour")
        payment_experience = request.data.get("payment_experience")
        review_comment = request.data.get("review_comment", "").strip()

        with transaction.atomic():
            review = JobReview.objects.create(
                hire_request=hire_request,
                reviewer_role="employer",
                reviewer_id=employer.id,
                receiver_role="customer",
                receiver_id=customer.id,
                overall_rating=overall_rating,
                communication=communication,
                behaviour=behaviour,
                payment_experience=payment_experience,
                review_comment=review_comment
            )

            # Update progress status flags
            progress = hire_request.progress
            progress.employer_review_submitted = True
            progress.employer_reviewed_at = timezone.now()
            progress.save()

            if progress.customer_review_submitted and progress.employer_review_submitted:
                hire_request.status = "fully_reviewed"
                hire_request.save()
                logger.info("Security Audit Alert: HireRequest %s marked as FULLY REVIEWED and closed", hire_request.id)

            # Trigger Notification to Customer
            try:
                Notification.objects.create(
                    recipient_type="customer",
                    recipient_id=customer.id,
                    sender_type="employer",
                    sender_id=employer.id,
                    notification_type="NEW_REVIEW",
                    title="New Review Received",
                    message=f"You received a new review from employer {getattr(employer, 'name', None) or employer.username}.",
                    reference_id=hire_request.id
                )
            except Exception as ex:
                logger.exception("Failed to send review notification to customer: %s", ex)

        return Response({"message": "Review submitted successfully.", "data": JobReviewSerializer(review).data}, status=status.HTTP_201_CREATED)

    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found."}, status=status.HTTP_404_NOT_FOUND)
    except Customer.DoesNotExist:
        return Response({"error": "Customer associated with this request not found."}, status=status.HTTP_404_NOT_FOUND)
    except Employer.DoesNotExist:
        return Response({"error": "Employer associated with this request not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error submitting customer review: %s", e)
        return Response({"error": "Failed to submit review."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def submit_employer_review(request):
    """
    Customer reviews Employer.
    """
    if request.user.role != "customer":
        return Response({"error": "Only customers can review employers."}, status=status.HTTP_403_FORBIDDEN)

    hire_request_id = request.data.get("hire_request_id")
    if not hire_request_id:
        return Response({"error": "hire_request_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        hire_request = HireRequest.objects.get(id=hire_request_id)
        if hire_request.customer_email.strip().lower() != request.user.email.strip().lower():
            logger.warning("Security Audit Alert: User %s attempted to review employer for HireRequest %s which belongs to another customer", request.user.email, hire_request_id)
            return Response({"error": "You are not authorized to review this job."}, status=status.HTTP_403_FORBIDDEN)

        if hire_request.status not in ["completed", "fully_reviewed"]:
            return Response({"error": "Reviews are only allowed after payment is completed."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already reviewed
        if JobReview.objects.filter(hire_request=hire_request, reviewer_role="customer").exists():
            return Response({"error": "You have already submitted a review for this job."}, status=status.HTTP_400_BAD_REQUEST)

        customer = Customer.objects.get(email=hire_request.customer_email)
        employer = Employer.objects.get(email=hire_request.employer_email)

        overall_rating = int(request.data.get("overall_rating", 5))
        work_quality = request.data.get("work_quality")
        communication = request.data.get("communication")
        professionalism = request.data.get("professionalism")
        behaviour = request.data.get("behaviour")
        review_comment = request.data.get("review_comment", "").strip()

        with transaction.atomic():
            review = JobReview.objects.create(
                hire_request=hire_request,
                reviewer_role="customer",
                reviewer_id=customer.id,
                receiver_role="employer",
                receiver_id=employer.id,
                overall_rating=overall_rating,
                work_quality=work_quality,
                communication=communication,
                professionalism=professionalism,
                behaviour=behaviour,
                review_comment=review_comment
            )

            # Update progress status flags
            progress = hire_request.progress
            progress.customer_review_submitted = True
            progress.customer_reviewed_at = timezone.now()
            progress.save()

            if progress.customer_review_submitted and progress.employer_review_submitted:
                hire_request.status = "fully_reviewed"
                hire_request.save()
                logger.info("Security Audit Alert: HireRequest %s marked as FULLY REVIEWED and closed", hire_request.id)

            # Trigger Notification to Employer
            try:
                Notification.objects.create(
                    recipient_type="employer",
                    recipient_id=employer.id,
                    sender_type="customer",
                    sender_id=customer.id,
                    notification_type="NEW_REVIEW",
                    title="New Review Received",
                    message="You received a new review from the customer.",
                    reference_id=hire_request.id
                )
            except Exception as ex:
                logger.exception("Failed to send review notification to employer: %s", ex)

        return Response({"message": "Review submitted successfully.", "data": JobReviewSerializer(review).data}, status=status.HTTP_201_CREATED)

    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found."}, status=status.HTTP_404_NOT_FOUND)
    except Customer.DoesNotExist:
        return Response({"error": "Customer associated with this request not found."}, status=status.HTTP_404_NOT_FOUND)
    except Employer.DoesNotExist:
        return Response({"error": "Employer associated with this request not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error submitting employer review: %s", e)
        return Response({"error": "Failed to submit review."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_job_reviews(request, hire_request_id):
    """
    Get customer and employer reviews for a specific HireRequest.
    """
    try:
        hire_request = HireRequest.objects.get(id=hire_request_id)
        # Auth check: must be customer, employer, or admin
        user_email = request.user.email.strip().lower()
        if request.user.role != "admin" and user_email not in [hire_request.customer_email.strip().lower(), hire_request.employer_email.strip().lower()]:
            return Response({"error": "You do not have permission to view reviews for this job."}, status=status.HTTP_403_FORBIDDEN)

        reviews = JobReview.objects.filter(hire_request=hire_request)
        
        customer_review = reviews.filter(reviewer_role="customer").first()
        employer_review = reviews.filter(reviewer_role="employer").first()

        return Response({
            "customer_review": JobReviewSerializer(customer_review).data if customer_review else None,
            "employer_review": JobReviewSerializer(employer_review).data if employer_review else None,
        }, status=status.HTTP_200_OK)

    except HireRequest.DoesNotExist:
        return Response({"error": "Hire request not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_employer_reviews_summary(request, employer_id):
    """
    Renders average rating, rating distribution counts, recent reviews list, and satisfaction score for employer profile.
    """
    try:
        employer = Employer.objects.get(id=employer_id)
        completed_jobs = HireRequest.objects.filter(employer_email=employer.email, status__in=["completed", "fully_reviewed"]).count()

        reviews = JobReview.objects.filter(receiver_role="employer", receiver_id=employer_id).order_by("-created_at")
        total_reviews = reviews.count()
        average_rating = reviews.aggregate(avg=Avg("overall_rating"))["avg"] or 0.0

        # Calculate satisfaction rate (percent of 4 and 5 star reviews)
        satisfaction_rate = 100
        if total_reviews > 0:
            positive_reviews = reviews.filter(overall_rating__gte=4).count()
            satisfaction_rate = int((positive_reviews / total_reviews) * 100)

        # Rating distribution
        distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
        dist_counts = reviews.values("overall_rating").annotate(count=Count("overall_rating"))
        for entry in dist_counts:
            rating = entry["overall_rating"]
            if rating in distribution:
                distribution[rating] = entry["count"]

        # Serialize list of recent reviews
        reviews_list = []
        for r in reviews[:15]:
            customer_name = "Customer"
            customer_avatar = None
            try:
                cust = Customer.objects.get(id=r.reviewer_id)
                customer_name = cust.fullname
            except Customer.DoesNotExist:
                pass

            reviews_list.append({
                "id": r.id,
                "reviewer_name": customer_name,
                "reviewer_avatar": customer_avatar,
                "overall_rating": r.overall_rating,
                "work_quality": r.work_quality,
                "communication": r.communication,
                "professionalism": r.professionalism,
                "behaviour": r.behaviour,
                "review_comment": r.review_comment,
                "created_at": r.created_at,
                "job_role": r.hire_request.job_role,
            })

        return Response({
            "average_rating": round(average_rating, 1),
            "total_reviews": total_reviews,
            "completed_jobs": completed_jobs,
            "satisfaction_rate": satisfaction_rate,
            "distribution": distribution,
            "reviews": reviews_list
        }, status=status.HTTP_200_OK)

    except Employer.DoesNotExist:
        return Response({"error": "Employer not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_customer_reviews_summary(request, customer_id):
    """
    Renders customer review statistics.
    """
    try:
        customer = Customer.objects.get(id=customer_id)
        completed_jobs = HireRequest.objects.filter(customer_email=customer.email, status__in=["completed", "fully_reviewed"]).count()

        reviews = JobReview.objects.filter(receiver_role="customer", receiver_id=customer_id).order_by("-created_at")
        total_reviews = reviews.count()
        average_rating = reviews.aggregate(avg=Avg("overall_rating"))["avg"] or 0.0

        reviews_list = []
        for r in reviews[:15]:
            employer_name = "Employer"
            try:
                emp = Employer.objects.get(id=r.reviewer_id)
                employer_name = getattr(emp, 'name', None) or emp.username
            except Employer.DoesNotExist:
                pass

            reviews_list.append({
                "id": r.id,
                "reviewer_name": employer_name,
                "overall_rating": r.overall_rating,
                "communication": r.communication,
                "behaviour": r.behaviour,
                "payment_experience": r.payment_experience,
                "review_comment": r.review_comment,
                "created_at": r.created_at,
                "job_role": r.hire_request.job_role,
            })

        return Response({
            "average_rating": round(average_rating, 1),
            "total_reviews": total_reviews,
            "completed_jobs": completed_jobs,
            "reviews": reviews_list
        }, status=status.HTTP_200_OK)

    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)
