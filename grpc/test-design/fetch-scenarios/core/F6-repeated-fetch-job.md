# F6. Repeated Fetch Job

## 목적

동일한 fetch 작업을 반복 수행할 때 장시간 안정성, connection reuse 효과, 메모리 누수 가능성을 비교한다.

## 적용 대상

- 주기 배치 작업
- 장시간 실행되는 sync worker
- 반복 폴링 기반 fetch job

## 고정 조건

- 동일 fetch 시나리오를 반복 사용
- 실행 간 데이터 구조와 총량은 동일 수준 유지
- 로깅 레벨과 모니터링 설정 고정
- retry 정책은 동일하게 맞춤

## 테스트 데이터 설계

| 항목 | 값 |
| --- | --- |
| 반복 시나리오 | F1, F2, F4 중 하나를 baseline으로 선택 |
| 총 반복 횟수 | `100`, `1000`, `10000` |
| 실행 시간 | `30분`, `2시간`, `8시간` |

## 주요 변수

| 항목 | 값 |
| --- | --- |
| job interval | `0초`, `1초`, `10초`, `1분` |
| connection reuse | on, off |
| protocol mode | REST H1, REST H2, gRPC H2 |
| client process lifecycle | persistent, restart per job |

## 실행 절차

1. 기준 fetch 시나리오 하나를 선택한다.
2. 동일 job을 정해진 interval로 반복 수행한다.
3. 장시간 구간에서 메모리, FD, connection 수 변화를 추적한다.
4. persistent process와 매 job 재시작 패턴을 분리 측정한다.
5. 실패가 발생하면 발생 시점과 누적 횟수를 별도 기록한다.

## 수집 지표

- 누적 완료 건수
- 작업당 평균 완료 시간
- 시간 경과에 따른 latency 변화
- 메모리 증가량
- 연결 수와 FD 사용량
- 에러율

## 해석 포인트

- 초기 성능보다 장시간 안정성과 자원 회수가 더 중요하다.
- connection reuse 이점은 장시간 반복 작업에서 더 크게 나타날 수 있다.
- persistent process와 restart per job은 성능보다 안정성 차이를 크게 만들 수 있다.

## 추가 확인 사항

- GC pause 또는 메모리 파편화 영향 기록
- stale connection 발생 여부 확인
- 장시간 TLS 세션 재협상 비용 확인
