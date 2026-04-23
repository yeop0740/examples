# F5. Multi-Request Workflow Fetch for Java + k6

## 목적

한 작업이 여러 fetch 요청 단계로 이어질 때 round-trip 누적 비용을 `REST`와 `gRPC` 기준으로 비교한다.

## Java 서버 설계

- REST 예시
- `GET /collections/{id}`
- `GET /collections/{id}/items`
- `GET /items/{id}`
- `GET /items/{id}/content`
- gRPC 예시
- `CollectionService/GetCollection`
- `CollectionService/ListItems`
- `ItemService/GetItem`
- `ItemService/GetItemContent`

## k6 설계

- executor: `shared-iterations`
- 1 iteration은 workflow 1회 전체 완료로 정의한다.
- `group()`로 단계별 latency를 태깅한다.
- fan-out 단계는 REST `http.batch()`와 gRPC `asyncInvoke()`로 분리 구현한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 단계 수 | `2`, `3`, `4`, `5` |
| fan-out 수 | `1`, `10`, `100` |
| workflow 수 | `100`, `1000`, `5000` |
| protocol | REST H1, REST H2, gRPC H2 |

## 실행 포인트

- fully sequential workflow와 mixed fan-out workflow를 구분한다.
- 각 단계의 응답 크기는 별도 tag 또는 scenario로 구분한다.
- 최종 workflow 완료율과 단계별 에러를 같이 기록한다.

## 판정 포인트

- workflow 전체 완료 시간
- 단계 수가 늘어날수록 누적 overhead가 얼마나 커지는지
- fan-out 단계에서 protocol별 오버헤드 차이

## 주의사항

- 이 케이스는 protocol 비교와 함께 클라이언트 orchestration 구현 품질이 같이 반영된다.
