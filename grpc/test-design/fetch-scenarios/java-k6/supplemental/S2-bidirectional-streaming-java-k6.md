# S2. Bidirectional Streaming for Java + k6

## 분류

별도 분리 케이스

## 목적

양방향 stream 세션에서 Java gRPC 서버의 세션 유지 비용과 message latency를 측정한다.

## Java 서버 설계

- gRPC: `SyncService/SyncStream` 같은 bidi stream method 사용
- REST는 직접 대응이 어렵기 때문에 long polling 또는 WebSocket 대체 실험으로 분리한다.

## k6 설계

- gRPC `Stream`으로 세션을 연다.
- message write/read를 반복하며 session duration을 유지한다.
- 세션 수와 메시지 빈도를 증가시킨다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| session 수 | `10`, `100`, `1000` |
| message 크기 | `1KB`, `10KB`, `100KB` |
| 빈도 | low, medium, high |

## 주의사항

- 이 케이스는 fetch 본류와 직접 비교하지 않는다.
- REST와의 직접 비교 대신 "별도 transport 설계 비교"로 표기하는 편이 맞다.
