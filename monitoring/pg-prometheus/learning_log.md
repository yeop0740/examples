# Learning Log - Prometheus & Postgres Exporter Connection

## 🇰🇷 Korean (한글)

### 문제 상황 (Issue)
1. **연결 실패**: Prometheus(컨테이너)가 `network_mode: host`로 실행 중인 Postgres Exporter(`db-metric` 컨테이너)에 연결하지 못함.
2. **네트워크 오류**: Grafana 이미지 다운로드(`nerdctl pull`) 시 `i/o timeout` 발생. `ping`은 되지만 TCP 연결이 안 되는 현상.

### 환경 (Environment)
- macOS
- Lima (VM)
- Nerdctl (Containerd)
- Rootless mode (루트리스 모드)

### 해결 과정 (Journey & Attempts)

#### 시도 1: `host.docker.internal` 사용
- **설정**: `targets: ['host.docker.internal:9187']`
- **결과**: 실패. Lima 환경에서 이는 VM이 아닌 macOS 호스트를 가리킴.

#### 시도 2: 브리지 게이트웨이 IP (`10.4.0.1`) 사용
- **설정**: `targets: ['10.4.0.1:9187']`
- **결과**: 실패. Rootless 모드의 `network_mode: host`는 브리지 네트워크와 격리됨.

#### 시도 3: 브리지 네트워크 사용 (최종 해결책 - 연결 문제)
- **변경 사항**:
    1. **docker-compose.yml**: `db-metric`의 `network_mode: host` 제거.
    2. **docker-compose.yml**: `DATA_SOURCE_URI`를 `database:5432`로 변경 (서비스 디스커버리 사용).
    3. **prometheus.yml**: 타겟을 `db-metric:9187`로 변경.
- **결과**: Prometheus <-> Exporter 통신 성공.

#### 시도 4: 네트워크 타임아웃 해결 (최종 해결책 - 이미지 풀)
- **증상**: `ping google.com`은 성공하나, `nerdctl pull`은 실패. VM 재시작으로도 해결 안 됨.
- **원인**: 호스트(노트북)의 불안정한 네트워크 상태가 VM의 TCP 연결에 영향을 줌.
- **해결**: 노트북의 네트워크(Wi-Fi 등)를 재연결하여 해결.

---

## 🇺🇸 English

### Issues
1. **Connection Failure**: Prometheus could not connect to Postgres Exporter running in `network_mode: host`.
2. **Network Error**: `i/o timeout` when pulling Grafana image. Ping worked, but TCP failed.

### Journey & Attempts

#### Attempt 1: `host.docker.internal`
- **Result**: Failed. Points to macOS host, not Lima VM.

#### Attempt 2: Bridge Gateway IP (`10.4.0.1`)
- **Result**: Failed. Rootless `network_mode: host` is isolated from bridge.

#### Attempt 3: Bridge Network (Final Solution - Connectivity)
- **Changes**:
    1. Removed `network_mode: host` from `db-metric`.
    2. Updated `DATA_SOURCE_URI` to `database:5432`.
    3. Updated Prometheus target to `db-metric:9187`.
- **Result**: Success.

#### Attempt 4: Network Timeout (Final Solution - Image Pull)
- **Symptom**: Ping worked, but `nerdctl pull` failed. VM restart didn't help.
- **Cause**: Unstable host (laptop) network affecting VM TCP connections.
- **Fix**: Reconnected laptop network.

---
## Final Artifacts Snapshot (2025-11-21)

### prometheus.yml
```yaml
scrape_configs:
  - job_name: cadvisor
    static_configs:
      - targets: ['cadvisor:8080']
  - job_name: postgres-exporter
    static_configs:
      - targets: ['db-metric:9187']
```

### docker-compose.yml (Snippet)
```yaml
  grafana:
    image: grafana/grafana-enterprise
    ports:
      - 3000:3000
    depends_on:
      - prometheus
```
