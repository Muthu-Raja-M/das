from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import traceback


def send_otp_to_email(email, otp):
    try:
        print("SENDGRID_API_KEY:", settings.SENDGRID_API_KEY)
        print("DEFAULT_FROM_EMAIL:", settings.DEFAULT_FROM_EMAIL)

        message = Mail(
            from_email=settings.DEFAULT_FROM_EMAIL,
            to_emails=email,
            subject="Blue Connect Password Reset OTP",
            html_content=f"""
            <h2>Blue Connect</h2>
            <p>Your OTP is:</p>
            <h1>{otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
            """
        )

        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)

        print("SENDGRID STATUS:", response.status_code)
        print("SENDGRID BODY:", response.body)
        print("SENDGRID HEADERS:", response.headers)

        return True

    except Exception as e:
        print("SENDGRID ERROR:", str(e))
        traceback.print_exc()
        if hasattr(e, "body"):
            print("SENDGRID ERROR BODY:", e.body)
        if hasattr(e, "headers"):
            print("SENDGRID ERROR HEADERS:", e.headers)
        return False