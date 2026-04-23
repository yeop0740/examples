# F2. Sequential Paged Fetch

## 목적

페이지 기반 순차 조회에서 page size와 총 round-trip 수가 `REST API`와 `gRPC`의 효율에 미치는 영향을 확인한다.

## 적용 대상

- 목록 API를 page 단위로 전부 읽어오는 작업
- 배치 export, 전체 동기화, 스캔성 조회

## 고정 조건

- 동일 총 데이터량 유지
- 페이지는 순서대로 조회
- 단일 worker 사용
- retry, cache, compression 비활성화

## 테스트 데이터 설계

| 항목 | 값 |
| --- | --- |
| 총 레코드 수 | `10k`, `100k`, `1M` |
| 레코드당 크기 | `0.5KB`, `2KB`, `8KB` |
| 정렬 기준 | `id asc` 고정 |

## 주요 변수

| 항목 | 값 |
| --- | --- |
| page size | `10`, `100`, `1000`, `5000` |
| 총 페이지 수 | 데이터 수와 page size에 따라 계산 |
| protocol mode | REST H1, REST H2, gRPC H2 |
| page token 방식 | numeric page, cursor token |

## 실행 절차

1. 전체 데이터 수와 정렬 기준을 고정한다.
2. 첫 페이지부터 마지막 페이지까지 순차 조회한다.
3. page size를 바꾸면서 같은 총 데이터량을 모두 읽는다.
4. numeric page와 cursor 방식이 모두 가능하면 분리 측정한다.
5. 각 조건을 3회 반복한다.

## 수집 지표

- 전체 완료 시간
- 페이지당 평균 latency, `p95`, `p99`
- 총 요청 수
- 서버/클라이언트 CPU 사용률
- 네트워크 바이트

## 해석 포인트

- page size가 작을수록 round-trip 수가 증가해 protocol overhead가 커질 수 있다.
- page size가 너무 크면 단일 응답 처리 비용과 메모리 사용량이 커진다.
- cursor 기반은 pagination 구현 차이도 섞일 수 있으므로 별도 기록이 필요하다.

## 추가 확인 사항

- page size 최적점 탐색
- large response 영역과 겹치는 지점 표시
- 서버 side prefetch 유무 기록
