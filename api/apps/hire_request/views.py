from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import HireRequest
from .serializers import HireRequestSerializer
from apps.messaging.models import ChatMessage


@api_view(['POST'])
def create_hire_request(request):
    serializer = HireRequestSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "message": "Hire request sent successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_employer_requests(request):
    email = request.GET.get("email")

    if not email:
        return Response(
            {"error": "Employer email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    requests = HireRequest.objects.filter(
        employer_email=email
    ).order_by('-created_at')

    serializer = HireRequestSerializer(requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_request_status(request, request_id):
    try:
        hire_request = HireRequest.objects.get(id=request_id)
    except HireRequest.DoesNotExist:
        return Response(
            {"error": "Request not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    status_value = request.data.get("status", "").strip().lower()

    print("STATUS RECEIVED:", status_value)
    print("REQUEST ID:", request_id)

    if status_value not in ["accepted", "rejected", "completed"]:
        return Response(
            {"error": "Invalid status"},
            status=status.HTTP_400_BAD_REQUEST
        )

    hire_request.status = status_value
    hire_request.save()

    if status_value == "accepted":
        already_exists = ChatMessage.objects.filter(
            hire_request=hire_request,
            sender_email=hire_request.employer_email,
            receiver_email=hire_request.customer_email,
            message__icontains="accepted"
        ).exists()

        if not already_exists:
            ChatMessage.objects.create(
                hire_request=hire_request,
                sender_email=hire_request.employer_email,
                receiver_email=hire_request.customer_email,
                message=f"Your hire request for {hire_request.job_role} has been accepted by the employer."
            )

    return Response(
        {
            "message": f"Request {status_value} successfully",
            "data": HireRequestSerializer(hire_request).data
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def get_employer_stats(request):
    email = request.GET.get("email")

    if not email:
        return Response(
            {"error": "Employer email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    queryset = HireRequest.objects.filter(employer_email=email)

    total_jobs = queryset.count()
    completed_jobs = queryset.filter(status="completed").count()
    pending_requests = queryset.filter(status="pending").count()
    accepted_requests = queryset.filter(status="accepted").count()
    rejected_requests = queryset.filter(status="rejected").count()

    return Response(
        {
            "total_jobs": total_jobs,
            "completed_jobs": completed_jobs,
            "pending_requests": pending_requests,
            "accepted_requests": accepted_requests,
            "rejected_requests": rejected_requests,
        },
        status=status.HTTP_200_OK
    )