# S5. Resume / Partial Retry Download for Java + k6

## 분류

별도 분리 케이스

## 목적

대용량 fetch 도중 일부 chunk가 실패할 때 resume과 partial retry 전략의 비용을 비교한다.

## Java 서버 설계

- REST: `Range` 재요청 또는 chunk endpoint 재요청
- gRPC: chunk unary 재호출 또는 stream 재개점 지정
- 테스트용으로 지정 chunk에서 실패를 주입할 수 있게 한다.

## k6 설계

- 기준은 F3 구조를 재사용한다.
- 실패 지점을 early, mid, late로 나눈다.
- retry 범위를 `full retry`와 `failed chunk only`로 나눈다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 파일 크기 | `100MB`, `1GB`, `5GB` |
| 실패 지점 | early, mid, late |
| retry 방식 | full, partial |

## 주의사항

- 정상 경로 성능보다 복구 시간과 추가 전송 바이트가 핵심 metric이다.
