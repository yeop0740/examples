# 08. Connection Churn

## 목적

짧은 연결 생성과 종료가 반복되는 환경에서 handshake와 connection setup 비용 차이를 확인한다.

## 시나리오 개요

- keep-alive를 끄거나 매우 짧게 유지한다.
- batch worker, serverless, short-lived job 같은 패턴을 가정한다.

## 고정 조건

- request/response는 작게 유지
- 서버 로직은 단순화
- 헤더 최소화
- 압축 비활성화

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 연결당 요청 수 | `1`, `5`, `20` |
| 새 연결 생성 속도 | `50`, `200`, `1000 conn/s` |
| client 수 | `10`, `100`, `500` |

## 실행 절차

1. REST는 keep-alive off 또는 매우 짧은 idle timeout으로 설정한다.
2. gRPC는 channel 재생성 주기를 제어해 같은 수준의 churn을 만든다.
3. 연결당 요청 수를 줄여가며 측정한다.
4. 가능하면 plain TCP와 TLS 모두 측정한다.

## 수집 지표

- 평균 latency, `p95`, `p99`
- connection create/close 횟수
- handshake 시간
- CPU 사용률
- 에러율

## 기대 관찰 포인트

- 커넥션 churn이 심할수록 재사용 이점이 사라지고 setup 비용이 지배적이 된다.
- 특히 TLS가 켜지면 차이가 더 커질 수 있다.

## 주의사항

- gRPC는 일반적으로 channel reuse가 권장되므로, channel 재생성 실험은 비권장 패턴이라는 점을 따로 기록한다.
- 짧은 연결 패턴은 클라이언트 구현 품질의 영향을 크게 받는다.
