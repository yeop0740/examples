# Implementation Plan - Prometheus & Grafana Setup

## Goal
Enable Prometheus to scrape metrics from `postgres-exporter` and visualize them in Grafana within a **Lima + Containerd (nerdctl)** environment.

## Changes

### Configuration

#### [MODIFY] [docker-compose.yml](file:///Users/heeyeop/Projects/examples/monitoring/pg-prometheus/docker-compose.yml)
- **db-metric**: Removed `network_mode: host` to join bridge network.
- **db-metric**: Updated `DATA_SOURCE_URI` to `database:5432`.
- **grafana**: Added Grafana service on port 3000.

#### [MODIFY] [prometheus.yml](file:///Users/heeyeop/Projects/examples/monitoring/pg-prometheus/prometheus.yml)
- Updated `postgres-exporter` target to `db-metric:9187`.

## Verification Plan

### Manual Verification
1. Start stack: `nerdctl compose up`
2. Prometheus: `http://localhost:9090/targets` (Check if UP)
3. Grafana: `http://localhost:3000` (Login: admin/admin)
