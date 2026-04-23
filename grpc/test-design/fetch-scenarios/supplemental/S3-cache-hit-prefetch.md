# S3. Cache Hit / Prefetch 포함

## 분류

별도 분류 케이스

## 별도 분리 이유

이 케이스는 protocol 차이보다 cache 전략과 prefetch 정책이 성능을 지배할 수 있다. 따라서 본류 fetch benchmark와 별도 해석이 필요하다.

## 목적

cache hit, warm cache, prefetch 유무가 전체 fetch 성능에 미치는 영향을 분리 측정한다.

## 적용 대상

- 자주 읽히는 hot object 조회
- 사전 prefetch를 수행하는 배치
- 메모리/로컬 디스크 캐시 활용 시나리오

## 주요 변수

| 항목 | 값 |
| --- | --- |
| cache 상태 | cold, warm, mixed |
| hit ratio | `0%`, `50%`, `90%` |
| prefetch | off, on |
| object 크기 | small, medium, large |

## 설계 포인트

- cold cache baseline을 먼저 확보한다.
- cache layer의 위치를 명확히 기록한다.
- protocol 차이와 cache 효과를 분리해서 결과를 표기한다.

## 수집 지표

- 총 완료 시간
- cache hit ratio
- backend call 감소율
- CPU / Memory 사용량

## 수행 시점

- 본류 fetch 성능을 본 뒤 최적화 단계에서 수행
