# 06. High RPS From Few Clients

## 목적

소수 클라이언트가 매우 빠르게 반복 호출할 때 per-call overhead와 connection reuse 효율을 비교한다.

## 시나리오 개요

- client 수는 적지만 각 client가 높은 RPS를 발생시킨다.
- 내부 서비스 간 통신처럼 소수 producer가 빠르게 호출하는 상황을 가정한다.

## 고정 조건

- request/response는 `1KB` 이하
- 헤더 최소화
- keep-alive 및 channel reuse 활성화
- 서버 자원은 충분히 확보

## 주요 변수

| 항목 | 값 |
| --- | --- |
| client 수 | `1`, `2`, `5` |
| 목표 부하 | `1000`, `5000`, `10000`, `20000 RPS` |
| 동시 in-flight 요청 | `1`, `8`, `32`, `128` |

## 실행 절차

1. baseline small unary payload를 그대로 사용한다.
2. client 수를 적게 유지한 채 각 client의 요청 속도를 높인다.
3. 동일한 커넥션 재사용 정책으로 REST와 gRPC를 비교한다.
4. 서버가 포화되기 전과 직후 지점을 모두 기록한다.

## 수집 지표

- 평균 latency, `p95`, `p99`
- 실제 달성 RPS
- 서버 CPU 사용률
- 소켓 수
- 에러율

## 기대 관찰 포인트

- `gRPC + HTTP/2`는 소수 커넥션에서 높은 동시성을 처리할 때 유리할 수 있다.
- REST는 `HTTP/1.1` 커넥션 수, 큐잉, per-request header 비용의 영향을 더 받을 수 있다.

## 주의사항

- load generator가 병목이 되지 않도록 별도 장비 또는 충분한 사양을 사용한다.
- 서버와 클라이언트의 CPU profile을 함께 보는 편이 좋다.
