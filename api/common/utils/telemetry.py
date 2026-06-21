print("OpenTelemetry started")

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor

# -----------------------------
# Service Name
# -----------------------------
resource = Resource.create({
    "service.name": "blueconnect-backend"
})

# -----------------------------
# Tracer Provider
# -----------------------------
provider = TracerProvider(
    resource=resource
)

# -----------------------------
# Jaeger OTLP HTTP Exporter
# -----------------------------
exporter = OTLPSpanExporter(
    endpoint="http://127.0.0.1:4318/v1/traces"
)

provider.add_span_processor(
    BatchSpanProcessor(exporter)
)

trace.set_tracer_provider(provider)

# -----------------------------
# Instrumentation
# -----------------------------
DjangoInstrumentor().instrument()
Psycopg2Instrumentor().instrument()
RequestsInstrumentor().instrument()

print("Django + PostgreSQL + HTTP instrumentation enabled")
print("OTLP endpoint: http://127.0.0.1:4318/v1/traces")
