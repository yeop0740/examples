# F6. Repeated Fetch Job for Java + k6

## 목적

동일 fetch job을 반복 수행하면서 장시간 안정성과 connection reuse 효과를 비교한다.

## Java 서버 설계

- 기준 workload는 F1, F2, F4 중 하나로 고정한다.
- REST와 gRPC는 동일 backend와 동일 데이터셋을 사용한다.
- JVM metric 수집을 위해 GC, heap, thread, socket metric을 노출한다.

## k6 설계

- executor: `constant-vus` 또는 `ramping-vus`
- 장시간 수행을 위해 `30m`, `2h`, `8h` 시나리오를 분리한다.
- 1 iteration은 고정된 fetch job 1회 수행으로 정의한다.
- 필요하면 scenario 태그로 `persistent`와 `reconnect-heavy` 패턴을 나눈다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| duration | `30m`, `2h`, `8h` |
| job interval | `0s`, `1s`, `10s`, `60s` |
| connection reuse | on, off |
| protocol | REST H1, REST H2, gRPC H2 |

## 실행 포인트

- long soak 전 smoke run으로 스크립트 안정성을 먼저 확인한다.
- JVM heap, GC pause, FD 수, connection 수를 시간축으로 기록한다.
- test 시작/중간/종료 지점에 server snapshot을 남긴다.

## 판정 포인트

- 시간이 지날수록 latency가 상승하는지
- 메모리/FD 누수 징후가 있는지
- reconnect-heavy 패턴에서 protocol 차이가 커지는지

## 주의사항

- 장시간 테스트는 protocol 차이보다 resource cleanup 문제를 더 잘 드러낸다.
