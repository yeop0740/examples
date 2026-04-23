# F4. Many Objects Parallel Fetch

## 목적

여러 파일 또는 object를 thread pool로 병렬 fetch 할 때 동시성 증가에 따른 효율과 안정성을 비교한다.

## 적용 대상

- 다수 object 백업
- 미디어 썸네일 일괄 조회
- 여러 key에 대한 대량 병렬 fetch

## 고정 조건

- 동일 object 목록 사용
- object별 응답 의미 동일
- worker/thread pool 구현 동일
- retry는 기본 비활성화

## 테스트 데이터 설계

| 항목 | 값 |
| --- | --- |
| object 수 | `100`, `1000`, `10000` |
| 크기 분포 | small-only, mixed, long-tail |
| object 크기 | `4KB`, `64KB`, `1MB`, `16MB` |

## 주요 변수

| 항목 | 값 |
| --- | --- |
| worker 수 | `1`, `4`, `8`, `16`, `32`, `64` |
| protocol mode | REST H1, REST H2, gRPC H2 |
| object size mix | uniform, mixed |
| fetch 방식 | queue pull, pre-assigned partition |

## 실행 절차

1. object 목록과 크기 분포를 고정한다.
2. thread pool이 object 단위 요청을 병렬 수행하도록 구현한다.
3. worker 수를 단계적으로 늘리며 전체 목록 fetch를 완료한다.
4. uniform 크기와 mixed 크기 분포를 분리 측정한다.
5. worker 수 증가에 따른 실패율과 tail latency를 함께 기록한다.

## 수집 지표

- 전체 완료 시간
- 평균 throughput
- object당 latency, `p95`, `p99`
- 활성 커넥션 수
- 서버/클라이언트 CPU / Memory
- 에러율

## 해석 포인트

- 작은 object 다건 조회에서는 프로토콜 오버헤드가 더 잘 드러날 수 있다.
- mixed 분포에서는 큰 object가 작은 object를 얼마나 지연시키는지 확인할 수 있다.
- worker 수 증가가 서버 포화나 클라이언트 contention을 얼마나 빠르게 유발하는지 본다.

## 추가 확인 사항

- object 크기별 결과를 분리 집계
- shared channel과 per-worker channel 전략 비교
- timeout과 부분 실패 재시도 비용 비교
