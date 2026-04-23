# REST API vs gRPC Fetch 테스트 케이스

## 목적

단순 unary 호출이 아니라 `데이터 fetch` 작업을 기준으로 `REST API`와 `gRPC`의 효율성을 비교하기 위한 테스트 케이스 초안이다.

## 비교 대상 범위

- 데이터를 하나씩 순차적으로 조회하는 경우
- 하나의 파일 또는 하나의 논리 데이터 묶음을 여러 thread로 병렬 fetch 하는 경우
- 하나의 작업이 여러 fetch 요청으로 구성되는 경우

## 상세 문서 구성

- 핵심 비교용 상세 설계는 [`fetch-scenarios/core/`](./fetch-scenarios/core) 아래 개별 문서로 분리했다.
- 별도 분류 케이스는 [`fetch-scenarios/supplemental/`](./fetch-scenarios/supplemental) 아래 개별 문서로 분리했다.
- 각 문서는 `목적`, `고정 조건 또는 분리 이유`, `주요 변수`, `실행 관점`, `수집 지표` 기준으로 정리했다.

## 핵심 테스트 케이스

| ID | 케이스 | 상세 문서 | 설명 | 주요 비교 포인트 |
| --- | --- | --- | --- | --- |
| F1 | Sequential fetch in for-loop | [F1-sequential-fetch-for-loop](./fetch-scenarios/core/F1-sequential-fetch-for-loop.md) | `for` 문으로 ID 또는 page를 하나씩 순차 조회 | 요청당 오버헤드, connection reuse, serialization 비용 |
| F2 | Sequential paged fetch | [F2-sequential-paged-fetch](./fetch-scenarios/core/F2-sequential-paged-fetch.md) | 페이지를 순서대로 넘기며 전체 데이터를 조회 | page size 변화에 따른 효율, 총 소요 시간 |
| F3 | Single file multithread fetch | [F3-single-file-multithread-fetch](./fetch-scenarios/core/F3-single-file-multithread-fetch.md) | 하나의 파일을 chunk/range로 나눠 여러 thread가 병렬 fetch | thread 수 대비 throughput, merge 비용, tail latency |
| F4 | Many objects parallel fetch | [F4-many-objects-parallel-fetch](./fetch-scenarios/core/F4-many-objects-parallel-fetch.md) | 여러 파일 또는 여러 object를 thread pool로 병렬 fetch | 동시 요청 수 증가 시 REST/gRPC 효율 차이 |
| F5 | Multi-request workflow fetch | [F5-multi-request-workflow-fetch](./fetch-scenarios/core/F5-multi-request-workflow-fetch.md) | 한 번의 작업이 `metadata -> list -> detail -> content` 식으로 여러 요청으로 이어짐 | 총 round-trip 수 증가 시 누적 오버헤드 |
| F6 | Repeated fetch job | [F6-repeated-fetch-job](./fetch-scenarios/core/F6-repeated-fetch-job.md) | 동일한 fetch 작업을 여러 번 반복 수행 | 장시간 수행 시 커넥션 재사용, 메모리 증가, 안정성 |

## 각 케이스 간략 설명

### F1. Sequential fetch in for-loop

- 가장 기본 비교 케이스다.
- 예: `idList`를 순회하면서 각 데이터 레코드를 하나씩 조회
- 측정 포인트
  - 전체 완료 시간
  - 건당 평균 latency
  - `p95`, `p99`
  - 서버/클라이언트 CPU 사용량

### F2. Sequential paged fetch

- 단건이 아니라 페이지 단위로 순차 fetch 하는 경우다.
- 예: `page=1 -> page=2 -> page=3`
- 변수
  - page size
  - 총 데이터 수
  - 응답 크기
- 측정 포인트
  - page size가 작을 때와 클 때의 총 fetch 시간 차이
  - REST JSON 파싱 비용 vs gRPC 메시지 처리 비용

### F3. Single file multithread fetch

- 하나의 파일을 여러 chunk로 분할하고 thread별로 병렬 fetch 한 뒤 합치는 경우다.
- 예: range 기반 다운로드, chunk 단위 블록 조회
- 변수
  - chunk size
  - thread 수
  - 파일 크기
- 측정 포인트
  - 총 다운로드 시간
  - thread 증가에 따른 throughput 증가폭
  - chunk merge 및 정렬 비용
  - thread 수가 많아질 때 커넥션/스트림 관리 비용

### F4. Many objects parallel fetch

- 하나의 파일이 아니라 여러 개의 파일 또는 object를 병렬 fetch 하는 경우다.
- 예: 100개 파일을 thread pool로 동시에 조회
- 변수
  - object 수
  - object 크기 분포
  - worker/thread 수
- 측정 포인트
  - 동시성 증가에 따른 총 처리량
  - 실패율 증가 시점
  - 작은 object 다건 조회에서 protocol overhead 차이

### F5. Multi-request workflow fetch

- 한 작업 안에서 여러 fetch 요청이 이어지는 경우다.
- 예: 목록 조회 후 각 item 상세 조회, 상세 조회 후 content 조회
- 변수
  - 단계 수
  - 단계별 응답 크기
  - fan-out 개수
- 측정 포인트
  - 총 round-trip 수가 많아질수록 누적되는 overhead
  - 순차 단계와 병렬 단계가 섞인 경우의 차이

### F6. Repeated fetch job

- 동일한 fetch 작업을 반복 실행하면서 장시간 효율과 안정성을 보는 케이스다.
- 예: 배치가 5분마다 반복 실행되거나 worker가 지속적으로 fetch 작업 수행
- 측정 포인트
  - 장시간 메모리 증가 여부
  - 커넥션 재사용 효과
  - 장기 실행 시 timeout, retry, error 누적 패턴

## 별도 분류가 필요한 케이스

아래 케이스는 `단순 fetch 효율 비교`와는 성격이 달라 별도 그룹으로 보는 편이 좋다.

| 분류 | 케이스 | 상세 문서 | 별도 분리 이유 |
| --- | --- | --- | --- |
| S1 | Server streaming fetch | [S1-server-streaming-fetch](./fetch-scenarios/supplemental/S1-server-streaming-fetch.md) | unary fetch보다 streaming 설계 영향이 더 큼 |
| S2 | Bidirectional streaming | [S2-bidirectional-streaming](./fetch-scenarios/supplemental/S2-bidirectional-streaming.md) | fetch라기보다 지속 세션/스트림 처리 성격이 강함 |
| S3 | Cache hit / prefetch 포함 | [S3-cache-hit-prefetch](./fetch-scenarios/supplemental/S3-cache-hit-prefetch.md) | protocol 차이보다 캐시 전략 영향이 더 큼 |
| S4 | DB/storage bottleneck 상태 | [S4-db-storage-bottleneck](./fetch-scenarios/supplemental/S4-db-storage-bottleneck.md) | API보다 backend storage 성능이 지배적일 수 있음 |
| S5 | Resume / partial retry download | [S5-resume-partial-retry-download](./fetch-scenarios/supplemental/S5-resume-partial-retry-download.md) | 장애 복구 전략 비교 성격이 강함 |
| S6 | Proxy/CDN/LB 경유 fetch | [S6-proxy-cdn-lb-fetch](./fetch-scenarios/supplemental/S6-proxy-cdn-lb-fetch.md) | 네트워크 장비와 middlebox 영향이 크게 섞임 |

## 우선순위 추천

처음에는 아래 순서로 보면 된다.

1. `F1 Sequential fetch in for-loop`
2. `F3 Single file multithread fetch`
3. `F5 Multi-request workflow fetch`
4. `F4 Many objects parallel fetch`
5. `F2 Sequential paged fetch`
6. `F6 Repeated fetch job`

## 부족하거나 추가하면 좋은 테스트

- `chunk size` 변화 테스트
- `page size` 변화 테스트
- thread 수 `1 / 2 / 4 / 8 / 16 / 32` 변화 테스트
- connection reuse on/off 테스트
- TLS on/off 테스트
- compression on/off 테스트
- 큰 파일 1개 vs 작은 파일 다수 비교
- 실패 응답이 일부 섞일 때 retry 비용 비교
- timeout이 짧을 때와 길 때 차이
- 동일 총 데이터량에서 `단건 다수 요청` vs `소수 대형 요청` 비교
- fetch 후 client 측 merge/aggregation 비용 측정
- 클라이언트 메모리 사용량과 GC 영향 측정

## 공통 측정 지표

- 전체 작업 완료 시간
- 요청당 평균 latency, `p95`, `p99`
- 총 처리량
- 서버 CPU / Memory
- 클라이언트 CPU / Memory
- 네트워크 송수신 바이트
- 에러율
- 활성 커넥션 수

## 메모

- fetch 테스트는 단순 unary 성능보다 `총 작업 완료 시간`이 더 중요할 수 있다.
- 한 파일 병렬 fetch는 protocol 비교뿐 아니라 `chunk 분할 전략`, `merge 비용`, `thread pool 구현` 영향을 같이 받는다.
- 여러 요청으로 이어지는 fetch는 protocol 차이보다도 `왕복 횟수` 설계가 성능에 큰 영향을 줄 수 있으므로 이를 별도 기록하는 것이 좋다.
