# Task Tracking

## 목적

이 파일은 현재 작업의 진행 상태를 기록하고, 다음에 수행할 작업을 계속 이어서 관리하기 위한 기준 문서다.

## 현재 상태

- 날짜: `2026-04-23`
- 작업 주제: `REST API vs gRPC` 성능 비교 테스트 설계
- 현재 초점: `단순 호출`과 `fetch` 계열 테스트 케이스 정리, `Java server + k6` 기준 상세 설계 문서화

## 한눈에 보기

- 현재 단계: `설계 문서화 완료`, `구현 미착수`, `실제 테스트 미실행`
- 완료 범위
  - 단순 호출 16개 케이스 인덱스와 상세 시나리오 정리 완료
  - fetch 케이스 `F1~F6`, `S1~S6` 인덱스와 상세 시나리오 정리 완료
  - `Java server + k6` 기준으로 fetch 케이스별 설계 문서 분리 완료
  - 작업 추적용 `task.md` 생성 완료
- 아직 하지 않은 범위
  - `Java server` 프로젝트 실제 생성
  - `REST API`, `gRPC proto/service` 실제 구현
  - `k6` 스크립트 실제 작성
  - 데이터셋 준비
  - 부하 테스트 실행 및 결과 분석

## 지금 바로 할 수 있는 작업

- `Java server` 기본 프로젝트 뼈대 생성
- 공통 domain/service를 기준으로 `REST`와 `gRPC` endpoint 설계 및 파일 생성
- 첫 번째 비교 대상인 `F1` 또는 `01 Baseline`용 API/proto 초안 작성
- 케이스별 `k6` 스크립트 골격 생성
- 테스트용 공통 데이터셋과 payload generator 정의
- JVM metric, 로그, 결과 저장 포맷 정리
- 실제 실행 순서와 우선순위 확정

## 현재 기준 작업 가능 범위

- 문서 설계 보강
- `Java server` 코드 구조 설계 및 초기 구현
- `REST` endpoint / `gRPC` proto / service 정의
- `k6` 스크립트 작성
- 테스트 실행 절차 문서화
- 측정 지표와 결과 포맷 정리
- 추후 실제 코드 작성 후 테스트 실행 준비

## 현재 기준 아직 없는 것

- 실행 가능한 서버 코드
- 실행 가능한 `k6` 스크립트
- 테스트용 샘플 데이터
- 실제 벤치마크 결과
- 결과 비교 보고서

## 완료한 작업

### 1. 단순 호출 성능 비교 문서 작성

- [rest-vs-grpc-test-cases.md](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/rest-vs-grpc-test-cases.md) 생성
- `baseline`, `header-heavy`, `large body`, `connection`, `burst`, `network`, `TLS`, `proxy`, `mixed traffic` 등 16개 케이스 인덱스 정리

### 2. 단순 호출 케이스별 상세 시나리오 분리

- [scenarios](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/scenarios) 디렉터리 생성
- `01`~`16` 각 케이스를 개별 `md` 파일로 분리
- 각 문서에 `목적`, `고정 조건`, `주요 변수`, `실행 절차`, `수집 지표`, `기대 관찰 포인트`, `주의사항` 정리

### 3. fetch 테스트 케이스 초안 작성

- [rest-vs-grpc-fetch-test-cases.md](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/rest-vs-grpc-fetch-test-cases.md) 생성
- 핵심 fetch 케이스 `F1~F6` 정리
- 별도 분리 케이스 `S1~S6` 정리
- 추가로 하면 좋은 테스트 목록 정리

### 4. fetch 케이스별 상세 문서 분리

- [fetch-scenarios/core](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios/core) 생성
- [fetch-scenarios/supplemental](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios/supplemental) 생성
- 핵심 케이스 `F1~F6` 상세 설계 작성
- 별도 분리 케이스 `S1~S6` 상세 설계 작성

### 5. Java server + k6 기준 문서 분리

- [fetch-scenarios/java-k6/README.md](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios/java-k6/README.md) 생성
- [fetch-scenarios/java-k6/core](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios/java-k6/core) 생성
- [fetch-scenarios/java-k6/supplemental](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios/java-k6/supplemental) 생성
- `Java server + k6` 기준으로 `F1~F6`, `S1~S6` 개별 문서 작성
- `k6`의 `HTTP/2`, `gRPC`, `batch`, `VU` 실행 모델 제약을 반영해 설계 보정

## 현재 산출물

- 단순 호출 인덱스: [rest-vs-grpc-test-cases.md](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/rest-vs-grpc-test-cases.md)
- 단순 호출 상세: [scenarios](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/scenarios)
- fetch 인덱스: [rest-vs-grpc-fetch-test-cases.md](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/rest-vs-grpc-fetch-test-cases.md)
- fetch 상세: [fetch-scenarios](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios)
- Java + k6 상세: [fetch-scenarios/java-k6](/Users/heeyeop/Projects/examples-grpc-demo/grpc/test-design/fetch-scenarios/java-k6)

## 다음에 할 작업

- `Java server` 프로젝트 구조 초안 생성
- `REST` endpoint와 `gRPC` service/proto 초안 작성
- 공통 데이터셋 정의
- 케이스별 `k6` 스크립트 골격 작성
- `F1~F6` 우선순위 기준 실행 순서 확정
- 측정 지표 수집 방식 정리
- 결과 저장 포맷 정의

## 단순 호출 설계 기준 추가 작업

- `01 Baseline Small Unary` 기준 REST/gRPC 공통 API 정의
- `02 Header-Heavy Request`용 공통 헤더 세트와 헤더 크기 단계 정의
- `03`, `04`, `05`용 payload generator 규격 정의
- `06`, `07`, `08`용 connection / concurrency 테스트 전략 확정
- `09 Burst Traffic`용 부하 패턴 정의
- `10`, `11`용 네트워크 지연/loss 주입 방식 정리
- `12 TLS`, `13 Compression`, `14 Proxy/LB` 환경 구성 방식 정리
- `15 Server Near Saturation` 측정 기준과 포화 판정 기준 정의
- `16 Mixed Traffic`용 혼합 비율과 대표 workload 정의
- 단순 호출 16개 케이스의 우선 구현 순서 확정

## 단순 호출 우선순위 제안

1. `01 Baseline Small Unary`
2. `02 Header-Heavy Request`
3. `03 Large Request Body`
4. `04 Large Response Body`
5. `06 High RPS From Few Clients`
6. `07 Many Concurrent Clients`
7. `08 Connection Churn`
8. `09 Burst Traffic`

## 우선순위 제안

1. `Java server` 기본 구조 생성
2. `F1 Sequential Fetch In For-Loop`용 REST/gRPC API 초안 작성
3. `F1` 기준 `k6` 스크립트 작성
4. 공통 데이터셋/테스트 설정 정리
5. `F3`, `F5` 케이스로 확장

## 메모

- `한 파일 멀티스레드 fetch`는 `k6`로 근사 가능하지만 JVM client의 실제 multithreading 비용을 완전히 대체하지는 못한다.
- `REST HTTP/2` 비교 시 실제 protocol이 `HTTP/2.0`으로 사용되는지 항상 기록해야 한다.
- `gRPC`는 `proto` 또는 `protoset` 관리 방식도 함께 정해야 한다.
- 단순 호출 설계와 fetch 설계는 구현 우선순위와 측정 관점이 다르므로 `task.md`에서 별도 항목으로 계속 관리한다.

## 업데이트 규칙

- 새로운 문서를 추가하면 `완료한 작업`과 `현재 산출물`을 갱신한다.
- 실제 구현이 시작되면 `다음에 할 작업`에서 완료된 항목을 제거하고 새 항목을 추가한다.
- 중요한 설계 변경이 생기면 `메모`에 이유를 남긴다.
