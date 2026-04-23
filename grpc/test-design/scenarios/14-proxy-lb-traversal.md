# 14. Proxy / LB Traversal

## 목적

ingress, API gateway, service mesh, LB를 지날 때 추가 hop과 프록시 처리 비용 차이를 비교한다.

## 시나리오 개요

- 직접 호출과 프록시 경유 호출을 분리한다.
- 운영 환경에 가까운 실제 네트워크 경로를 반영한다.

## 고정 조건

- baseline small unary 또는 header-heavy payload 사용
- 서버 로직 단순화
- proxy 설정 외 다른 조건은 동일하게 유지

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 경로 | direct, `LB 1단`, `gateway + service mesh` |
| 프로토콜 | REST H1, REST H2, gRPC H2 |
| 목표 부하 | `100`, `500`, `2000 RPS` |

## 실행 절차

1. direct 경로를 먼저 baseline으로 측정한다.
2. 그다음 `LB 1단` 경로에서 같은 테스트를 반복한다.
3. 가능하면 `gateway + mesh` 구간도 추가한다.
4. 각 hop에서 protocol downgrade 여부를 확인한다.

## 수집 지표

- 평균 latency, `p95`, `p99`
- 각 hop의 응답 시간 분해
- 에러율
- 네트워크 바이트
- 프록시 CPU/메모리 사용률

## 기대 관찰 포인트

- proxy가 `HTTP/2` 또는 `gRPC`를 얼마나 제대로 유지하는지에 따라 차이가 크게 달라진다.
- 일부 환경에서는 프로토콜 자체보다 gateway 처리 비용이 더 지배적일 수 있다.

## 주의사항

- `gRPC`를 내부적으로 `HTTP/1.1`로 downgrade하는 구성은 별도 표시가 필요하다.
- proxy timeout, header size limit, max stream 설정을 사전에 점검한다.
