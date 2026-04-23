# F1. Sequential Fetch In For-Loop

## 목적

가장 단순한 순차 fetch 패턴에서 `REST API`와 `gRPC`의 요청당 오버헤드와 총 작업 완료 시간을 비교한다.

## 적용 대상

- `idList`를 순회하며 레코드를 하나씩 조회하는 작업
- 배치성 정합성 확인 작업
- 캐시 미적용 상태의 단순 단건 fetch

## 고정 조건

- 동일한 데이터셋과 동일한 조회 로직 사용
- 클라이언트는 단일 thread 또는 단일 worker만 사용
- connection reuse는 기본적으로 활성화
- retry, compression, cache는 비활성화

## 테스트 데이터 설계

| 항목 | 값 |
| --- | --- |
| 총 데이터 건수 | `1k`, `10k`, `100k` |
| 단건 payload 크기 | `1KB`, `10KB`, `50KB` |
| 데이터 형태 | 평면 JSON/protobuf, 중간 depth 구조 |
| 조회 키 분포 | 연속 ID, 랜덤 ID |

## 주요 변수

| 항목 | 값 |
| --- | --- |
| fetch 건수 | `100`, `1000`, `10000` |
| 응답 크기 | `1KB`, `10KB`, `50KB` |
| 키 순서 | ordered, random |
| protocol mode | REST H1, REST H2, gRPC H2 |

## 실행 절차

1. 클라이언트가 같은 데이터셋을 같은 순서로 조회하도록 준비한다.
2. `for` 문으로 각 ID를 하나씩 순차 요청한다.
3. 각 요청의 완료 후 다음 요청을 보내도록 고정한다.
4. 각 fetch 건수 구간별로 3회 이상 반복한다.
5. ordered ID와 random ID를 분리해서 측정한다.

## 수집 지표

- 전체 작업 완료 시간
- 요청당 평균 latency, `p95`, `p99`
- 서버/클라이언트 CPU 사용률
- 네트워크 송수신 바이트
- 에러율

## 해석 포인트

- 요청 건수가 많아질수록 per-request overhead가 누적되는 정도를 본다.
- random ID는 backend locality 영향을 받을 수 있으므로 ordered 결과와 분리 해석해야 한다.
- `REST H2`를 같이 보면 포맷 차이와 전송 계층 차이를 나눠서 볼 수 있다.

## 추가 확인 사항

- connection reuse off를 별도 변형 케이스로 실행
- TLS on/off 비교
- payload 크기 증가에 따른 누적 시간 증가율 비교
