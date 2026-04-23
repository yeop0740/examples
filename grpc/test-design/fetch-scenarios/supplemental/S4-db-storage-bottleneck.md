# S4. DB / Storage Bottleneck 상태

## 분류

별도 분류 케이스

## 별도 분리 이유

backend DB 또는 storage가 병목인 상태에서는 API protocol보다 저장소 성능이 결과를 지배할 수 있다. 이 경우 protocol 비교값을 직접적인 결론으로 사용하면 안 된다.

## 목적

backend bottleneck이 존재할 때 protocol 차이가 얼마나 희석되는지 확인한다.

## 적용 대상

- 느린 DB 조회
- object storage throttling
- remote disk 또는 network storage 병목

## 주요 변수

| 항목 | 값 |
| --- | --- |
| backend latency | `5ms`, `20ms`, `100ms`, `500ms` |
| concurrency | low, medium, high |
| protocol mode | REST H1, REST H2, gRPC H2 |

## 설계 포인트

- application layer 비용과 backend 비용을 분리 계측한다.
- storage latency injection이나 throttling을 명시적으로 사용한다.
- 본류 fetch 결과와 같은 표에 섞지 않는다.

## 수집 지표

- 전체 완료 시간
- backend wait time
- API layer processing time
- 에러율

## 수행 시점

- 실제 운영 병목이 storage 쪽에 있는지 확인할 필요가 있을 때 수행
