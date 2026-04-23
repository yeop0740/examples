# F4. Many Objects Parallel Fetch for Java + k6

## 목적

여러 object를 동시에 가져오는 작업에서 `REST`와 `gRPC`의 동시성 효율을 비교한다.

## Java 서버 설계

- REST: `GET /objects/{id}`
- gRPC: `ObjectService/GetObject`
- object 크기는 small-only와 mixed 분포 두 가지를 준비한다.
- object 목록은 테스트 시작 전에 고정한다.

## k6 설계

- executor: `constant-vus` 또는 `ramping-vus`
- 1 iteration은 object 1건 fetch 또는 object 묶음 fetch로 정의한다.
- REST는 `http.batch()` 또는 개별 `http.get()` 반복 중 하나로 고정한다.
- gRPC는 `asyncInvoke()` 기반 병렬 unary 호출 또는 VU 확장 방식으로 맞춘다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| object 수 | `100`, `1000`, `10000` |
| object 크기 | `4KB`, `64KB`, `1MB`, `16MB` |
| VU 수 | `1`, `4`, `8`, `16`, `32`, `64` |
| 크기 분포 | uniform, mixed |

## 실행 포인트

- uniform과 mixed workload를 분리한다.
- object 크기별 tag를 붙여 latency를 분해한다.
- batch 기반과 VU 확장 기반은 별도 run으로 구분한다.

## 판정 포인트

- 동시성 증가에 따른 처리량 증가폭
- 작은 object 다건 조회에서 protocol overhead 차이
- mixed 분포에서 noisy neighbor 발생 여부

## 주의사항

- `http.batch()`는 여러 TCP 연결에서 병렬 요청을 보내므로, REST batch와 gRPC channel/stream 모델의 차이를 결과에 명시해야 한다.
