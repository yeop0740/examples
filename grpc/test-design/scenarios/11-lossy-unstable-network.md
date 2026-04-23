# 11. Lossy / Unstable Network

## 목적

packet loss, jitter, 불안정 네트워크가 있을 때 tail latency와 에러율이 어떻게 달라지는지 확인한다.

## 시나리오 개요

- RTT는 중간 수준으로 유지하고 loss와 jitter를 별도로 가한다.
- 모바일망, 와이파이 불안정 구간, 인터넷 구간 통신을 가정한다.

## 고정 조건

- 작은 unary 호출 사용
- 커넥션 재사용 활성화
- 재시도 정책은 기본적으로 비활성화하거나 동일하게 고정

## 주요 변수

| 항목 | 값 |
| --- | --- |
| packet loss | `0.1%`, `1%`, `3%` |
| jitter | `5ms`, `20ms`, `50ms` |
| RTT | `20ms`, `50ms` |
| 목표 부하 | `100`, `500 RPS` |

## 실행 절차

1. loss만 있는 조건, jitter만 있는 조건, 둘 다 있는 조건으로 나눈다.
2. 각 조건에서 동일한 부하를 5분간 유지한다.
3. timeout, retry, circuit breaker는 동일 정책으로 맞춘다.
4. 응답 실패 유형을 timeout, transport error, application error로 구분 기록한다.

## 수집 지표

- 평균 latency, `p95`, `p99`
- timeout 비율
- transport error 비율
- 재전송 추정량
- 실제 처리량

## 기대 관찰 포인트

- 평균값보다 `p95`, `p99`와 timeout 비율이 더 큰 차이를 보일 가능성이 높다.
- 프로토콜 자체보다 클라이언트 라이브러리의 timeout 및 flow control 구현 영향도 확인할 수 있다.

## 주의사항

- retry를 켜면 결과 해석이 복잡해지므로 1차 실험은 retry off가 낫다.
- LB나 proxy가 loss를 가리는 구조인지 먼저 확인해야 한다.
