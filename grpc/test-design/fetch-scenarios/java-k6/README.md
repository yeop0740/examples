# Java Server + k6 기준 Fetch 테스트 설계

## 목적

이 디렉터리는 `Java server`를 기준으로 `REST API`와 `gRPC` fetch 테스트를 `k6`로 수행하기 위한 케이스별 설계 문서를 모아둔 곳이다.

## 디렉터리 구성

- `core/`: 직접 비교에 사용하는 핵심 fetch 케이스
- `supplemental/`: 별도 분리해서 봐야 하는 보조 케이스

## 공통 Java 서버 기준

- 동일한 `service`와 `repository`를 공유하고 transport layer만 `REST`와 `gRPC`로 분리한다.
- 권장 구성은 `Spring Boot 3 REST controller`와 `grpc-java(Netty)` 또는 이에 준하는 Java gRPC 서버다.
- `REST`와 `gRPC`는 같은 데이터셋, 같은 직렬화 의미, 같은 backend 의존성을 사용한다.
- `REST H1`과 `REST H2`를 모두 비교할 경우 포트를 분리하거나 서버 구성을 분리해 protocol이 섞이지 않게 한다.

## 공통 k6 기준

- `HTTP` 요청은 `k6/http`를 사용한다.
- `gRPC` 요청은 `k6/net/grpc`를 사용한다.
- `gRPC` 스키마는 `Client.load()`, `Client.loadProtoset()`, 또는 `reflect: true` 중 하나로 로드한다.
- `k6`의 `HTTP`는 서버가 지원하면 자동으로 `HTTP/2`로 업그레이드되므로 응답의 `proto` 값으로 실제 protocol을 확인한다.
- `k6 VU`는 single-threaded이므로 JVM client의 실제 multithreading을 완전히 재현하지는 못한다. 병렬성은 `VU 수`, `http.batch()`, `asyncInvoke()`, `Stream` 조합으로 근사한다.
- `gRPC` 메시지는 k6에서 JSON 형태로 받아 protojson 경유 인코딩/디코딩되므로 client-side pure protobuf benchmark로 해석하면 안 된다.

## 공통 측정 지표

- 전체 작업 완료 시간
- 요청당 평균 latency, `p95`, `p99`
- 총 처리량
- 서버 CPU / Memory
- 클라이언트 host CPU / Memory
- 네트워크 송수신 바이트
- 에러율
- 활성 커넥션 수

## 공통 산출물

- 케이스별 `k6` 스크립트
- 서버 로그와 JVM metric
- `k6` summary 결과
- protocol 검증 결과

## 참고

- `k6`는 공식 문서 기준으로 `HTTP/1.1`, `HTTP/2`, `gRPC`를 지원한다.
- `gRPC` unary와 streaming은 `k6/net/grpc` core module에서 지원된다.
