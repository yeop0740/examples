# 12. TLS Enabled

## 목적

TLS 또는 mTLS 환경에서 암호화와 handshake가 성능에 주는 영향을 비교한다.

## 시나리오 개요

- plain 통신과 TLS, mTLS를 나눠 측정한다.
- connection reuse가 있는 일반 패턴과 connection churn 패턴을 함께 본다.

## 고정 조건

- baseline small unary payload 사용
- 인증서 크기와 검증 정책은 고정
- 서버 로직은 단순 응답

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 보안 모드 | plain, `TLS`, `mTLS` |
| 연결 패턴 | reuse, churn |
| 목표 부하 | `100`, `500`, `2000 RPS` |
| client 수 | `5`, `50` |

## 실행 절차

1. 먼저 plain 환경에서 baseline을 측정한다.
2. 같은 환경에 TLS를 적용해 반복 측정한다.
3. 가능하면 client cert까지 켠 mTLS도 같은 방식으로 측정한다.
4. reuse와 churn 패턴을 분리해서 각각 실행한다.

## 수집 지표

- 평균 latency, `p95`, `p99`
- handshake 시간
- CPU 사용률
- 에러율
- 연결 생성 속도

## 기대 관찰 포인트

- reuse 환경에서는 TLS 오버헤드가 제한적일 수 있지만 churn 환경에서는 크게 증가할 수 있다.
- gRPC가 보통 장기 연결을 전제로 하므로 TLS 비용이 상대적으로 덜 문제되는지 확인할 수 있다.

## 주의사항

- 인증서 갱신이나 OCSP 같은 외부 요소는 실험에서 제외하는 편이 좋다.
- cipher suite 차이가 크므로 하나로 고정한다.
