# F1. Sequential Fetch In For-Loop for Java + k6

## 목적

단일 thread 수준의 순차 fetch에서 Java 서버의 `REST`와 `gRPC` 차이를 가장 단순한 형태로 비교한다.

## Java 서버 설계

- REST: `GET /records/{id}`
- gRPC: `RecordService/GetRecord`
- 두 endpoint 모두 같은 `RecordService`를 호출한다.
- 응답 payload는 작은 레코드, 중간 레코드, 큰 레코드 3종으로 나눈다.

## k6 설계

- executor: `shared-iterations`
- 1 iteration은 레코드 1건 fetch로 정의한다.
- REST 스크립트는 `http.get()` 사용
- gRPC 스크립트는 `Client.invoke()` 사용
- 테스트 데이터는 `SharedArray` 또는 정적 파일로 ID 목록을 고정한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| iteration 수 | `1k`, `10k`, `100k` |
| payload 크기 | `1KB`, `10KB`, `50KB` |
| ID 순서 | ordered, random |
| protocol | REST H1, REST H2, gRPC H2 |

## 실행 포인트

- REST H2 비교 시 `res.proto`로 실제 protocol 사용 여부를 반드시 기록한다.
- gRPC는 proto 파일 또는 protoset을 고정 사용한다.
- warm-up 후 본 측정을 3회 이상 반복한다.

## 판정 포인트

- 건당 latency 차이
- 동일 iteration 수에서 전체 완료 시간 차이
- payload 크기가 커질 때 증가율 차이

## 주의사항

- k6는 VU 단위 동시성 도구이므로 이 케이스는 `1 VU` 또는 매우 낮은 `VU`로 고정하는 편이 맞다.
- backend cache 영향이 섞이지 않도록 ordered/random 결과를 분리한다.
