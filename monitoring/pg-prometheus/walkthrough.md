# Walkthrough - Prometheus & Grafana Setup

I have successfully configured the monitoring stack with Prometheus, Postgres Exporter, and Grafana.

## Changes

### [docker-compose.yml](file:///Users/heeyeop/Projects/examples/monitoring/pg-prometheus/docker-compose.yml)

1. **Networking**: Switched `db-metric` to bridge network.
2. **Database**: Updated connection string to `database:5432`.
3. **Grafana**: Added Grafana service.

```yaml
  grafana:
    image: grafana/grafana-enterprise
    ports:
      - 3000:3000
    depends_on:
      - prometheus
```

### [prometheus.yml](file:///Users/heeyeop/Projects/examples/monitoring/pg-prometheus/prometheus.yml)

Updated target to `db-metric:9187`.

## Verification Results

### Services Status
All services are running:
- `prometheus`: 9090
- `grafana`: 3000
- `cadvisor`: 8000 (mapped to 8080 internal)
- `db-metric`: (internal 9187)
- `database`: 5450

### Access
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Grafana**: [http://localhost:3000](http://localhost:3000) (Default login: `admin` / `admin`)
