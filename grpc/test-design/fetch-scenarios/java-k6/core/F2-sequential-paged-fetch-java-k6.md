# F2. Sequential Paged Fetch for Java + k6

## 목적

페이지 기반 순차 fetch에서 page size와 round-trip 수 증가가 `REST`와 `gRPC`에 주는 영향을 비교한다.

## Java 서버 설계

- REST: `GET /records?page={n}&size={m}` 또는 cursor 기반 endpoint
- gRPC: `ListRecords(ListRequest) returns (ListResponse)`
- 정렬 기준은 `id asc`로 고정한다.
- 총 데이터 수는 모든 protocol에서 동일하게 유지한다.

## k6 설계

- executor: `per-vu-iterations`
- 1 iteration은 "첫 페이지부터 마지막 페이지까지 전체 fetch"로 정의한다.
- 각 VU는 같은 page size 조건을 사용한다.
- page token과 numeric page는 별도 스크립트 또는 별도 scenario로 분리한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 총 데이터 수 | `10k`, `100k`, `1M` |
| page size | `10`, `100`, `1000`, `5000` |
| 페이지 방식 | numeric, cursor |
| protocol | REST H1, REST H2, gRPC H2 |

## 실행 포인트

- page size별로 전체 읽기 완료 시간을 기록한다.
- 응답 body가 커지는 구간에서는 client memory와 parse 비용도 같이 수집한다.
- scenario 태그로 page size를 분리해 결과를 비교한다.

## 판정 포인트

- 총 요청 수 대비 누적 오버헤드
- page size 최적점
- 같은 총 데이터량일 때 protocol별 전체 소요 시간

## 주의사항

- cursor 구현은 서버 코드 차이가 개입되기 쉬우므로 numeric page 결과와 직접 혼합 해석하지 않는다.
