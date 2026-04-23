# F5. Multi-Request Workflow Fetch

## 목적

하나의 사용자 작업이 여러 fetch 요청 단계로 이어질 때 누적 round-trip 비용과 fan-out 비용을 비교한다.

## 적용 대상

- `metadata -> list -> detail -> content` 흐름
- 검색 후 상세 조회
- 목록 조회 후 각 항목별 부가정보 fetch

## 고정 조건

- 동일 workflow 단계와 동일 데이터 의미 유지
- 단계 간 의존성은 동일하게 유지
- 캐시와 prefetch는 기본 비활성화
- workflow 완료 기준도 동일하게 맞춤

## 테스트 데이터 설계

| 항목 | 값 |
| --- | --- |
| 단계 수 | `2`, `3`, `4`, `5` |
| 단계별 fan-out | `1`, `10`, `100` |
| 단계별 응답 크기 | `1KB`, `10KB`, `100KB` |

## 주요 변수

| 항목 | 값 |
| --- | --- |
| workflow 타입 | fully sequential, mixed fan-out |
| fan-out 병렬도 | `1`, `4`, `8`, `16` |
| protocol mode | REST H1, REST H2, gRPC H2 |
| 최종 작업 수 | `100`, `1000`, `5000 workflows` |

## 실행 절차

1. workflow 단계를 명확히 정의한다.
2. 각 단계의 입력과 출력이 다음 단계로 동일하게 연결되도록 맞춘다.
3. fully sequential workflow와 중간 fan-out workflow를 분리 측정한다.
4. workflow 수를 늘리며 전체 완료 시간과 단계별 latency를 기록한다.
5. 단계 수와 fan-out 수를 바꿔 누적 비용을 비교한다.

## 수집 지표

- workflow 전체 완료 시간
- 단계별 latency 분포
- 총 요청 수
- 서버/클라이언트 CPU / Memory
- 에러율

## 해석 포인트

- 단일 요청 차이보다 round-trip 누적 횟수가 전체 시간에 더 큰 영향을 줄 수 있다.
- fan-out 구간은 protocol보다 클라이언트 orchestration 구현 품질 영향을 많이 받는다.
- 단계 수가 늘수록 직렬 구간의 per-request overhead가 누적되는지 본다.

## 추가 확인 사항

- 단계별 병목 위치 기록
- 특정 단계를 batch API로 대체했을 때 개선폭 추정
- metadata/list/detail/content 각각의 payload 비율 변경 실험
