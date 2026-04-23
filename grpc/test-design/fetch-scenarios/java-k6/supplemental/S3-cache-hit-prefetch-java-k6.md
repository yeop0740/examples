# S3. Cache Hit / Prefetch for Java + k6

## 분류

별도 분리 케이스

## 목적

cache hit와 prefetch 유무가 protocol 차이를 얼마나 가리는지 확인한다.

## Java 서버 설계

- application cache 또는 near-cache를 명시적으로 켜고 끈다.
- cache hit ratio를 metric으로 노출한다.
- prefetch worker 사용 여부를 설정 가능하게 한다.

## k6 설계

- executor: `shared-iterations`
- cold, warm, mixed cache를 scenario로 분리한다.
- 동일 ID 목록을 재사용해 hit ratio를 제어한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| cache 상태 | cold, warm, mixed |
| hit ratio | `0%`, `50%`, `90%` |
| prefetch | off, on |

## 주의사항

- 결과 해석의 중심은 protocol이 아니라 cache 전략이다.
- 본류 fetch 결과와 같은 표에 넣지 않는 편이 좋다.
