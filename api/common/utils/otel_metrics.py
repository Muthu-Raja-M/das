from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.prometheus import PrometheusMetricReader
from prometheus_client import start_http_server

# 1. Start Prometheus endpoint (this exposes metrics)
start_http_server(port=8001)

# 2. Create Prometheus reader
prometheus_reader = PrometheusMetricReader()

# 3. Set Meter Provider
provider = MeterProvider(metric_readers=[prometheus_reader])
metrics.set_meter_provider(provider)

# 4. Create meter
meter = metrics.get_meter("blue-connect")

# 5. Create metric
request_counter = meter.create_counter(
    name="api_requests",
    description="Number of API requests"
)
