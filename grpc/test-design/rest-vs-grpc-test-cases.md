# REST API vs gRPC 성능 비교 테스트 케이스

## 목적

단순 호출형 API를 기준으로 `REST API`에서 `gRPC`로 변경했을 때 성능 차이가 어떤 조건에서 크게 나타나는지 확인하기 위한 테스트 케이스 인덱스다.

## 비교 전제

- 동일한 비즈니스 로직, 동일한 데이터 의미, 동일한 서버 자원 조건에서 비교한다.
- 가능하면 `REST + HTTP/1.1`, `REST + HTTP/2`, `gRPC + HTTP/2`를 분리해서 본다.
- 응답 성공 기준, 타임아웃, 재시도 정책은 동일하게 맞춘다.

## 공통 측정 지표

- 평균 latency, `p95`, `p99`
- 초당 처리량(`RPS`)
- 서버 CPU / Memory 사용량
- 네트워크 송수신 바이트 수
- 에러율
- 활성 커넥션 수, 커넥션 생성/종료 빈도

## 상세 문서 구성

- 케이스별 상세 실험 시나리오는 [`scenarios/`](./scenarios) 아래 개별 `md` 파일로 분리했다.
- 각 문서는 `목적`, `고정 조건`, `주요 변수`, `실행 절차`, `수집 지표`, `기대 관찰 포인트`, `주의사항` 순서로 통일했다.

## 테스트 케이스

| ID | 케이스 | 상세 문서 | 설명 | 주요 변수 | 기대 관찰 포인트 |
| --- | --- | --- | --- | --- | --- |
| 1 | Baseline small unary | [01-baseline-small-unary](./scenarios/01-baseline-small-unary.md) | 매우 작은 request/response로 가장 단순한 호출 비교 | payload 1KB 이하, 적은 헤더, 소수 client | 직렬화/프로토콜 자체 오버헤드 차이 |
| 2 | Header-heavy request | [02-header-heavy-request](./scenarios/02-header-heavy-request.md) | 인증/추적/메타데이터 헤더가 많은 요청 | 헤더 개수, 헤더 총 크기 | REST는 텍스트 헤더 부담, gRPC는 metadata + HPACK 영향 확인 |
| 3 | Large request body | [03-large-request-body](./scenarios/03-large-request-body.md) | 요청 본문이 큰 경우 | request size 10KB, 100KB, 1MB 이상 | JSON 파싱 비용 대비 protobuf 직렬화 이점 |
| 4 | Large response body | [04-large-response-body](./scenarios/04-large-response-body.md) | 응답 본문이 큰 경우 | response size 단계별 증가 | 응답 크기 증가 시 bandwidth와 serialization 비용 차이 |
| 5 | Many fields / nested structure | [05-many-fields-nested-structure](./scenarios/05-many-fields-nested-structure.md) | 필드 수가 많고 구조가 깊은 데이터 | 평면 구조 vs 중첩 구조 | JSON 인코딩/디코딩과 protobuf 처리 비용 차이 |
| 6 | High RPS from few clients | [06-high-rps-from-few-clients](./scenarios/06-high-rps-from-few-clients.md) | 소수 client가 keep-alive로 매우 빠르게 반복 호출 | client 수 적음, 요청 빈도 높음 | connection reuse, multiplexing, per-call overhead 차이 |
| 7 | Many concurrent clients | [07-many-concurrent-clients](./scenarios/07-many-concurrent-clients.md) | 동시에 접속하는 client 수가 매우 많음 | 100, 1k, 10k client | 커넥션 관리 비용, thread/event loop 부담, head-of-line 영향 |
| 8 | Connection churn | [08-connection-churn](./scenarios/08-connection-churn.md) | 짧게 연결하고 바로 종료하는 패턴 | keep-alive off/on, 짧은 세션 | handshake 및 커넥션 생성 비용 차이 |
| 9 | Burst traffic | [09-burst-traffic](./scenarios/09-burst-traffic.md) | 평소에는 낮다가 짧은 순간 급증하는 트래픽 | burst 크기, burst 간격 | 큐 적체, tail latency, 급격한 스파이크 대응 차이 |
| 10 | High latency network | [10-high-latency-network](./scenarios/10-high-latency-network.md) | RTT가 큰 네트워크 환경 | 10ms, 50ms, 100ms 이상 | HTTP/2 multiplexing과 connection reuse 효과 |
| 11 | Lossy / unstable network | [11-lossy-unstable-network](./scenarios/11-lossy-unstable-network.md) | packet loss나 jitter가 있는 환경 | packet loss %, jitter | 재전송 상황에서 tail latency와 에러율 변화 |
| 12 | TLS enabled | [12-tls-enabled](./scenarios/12-tls-enabled.md) | TLS 또는 mTLS 적용 환경 | TLS on/off, 인증서 검증 | 암호화 오버헤드와 handshake 영향 |
| 13 | Compression on/off | [13-compression-on-off](./scenarios/13-compression-on-off.md) | 압축 사용 여부에 따른 차이 | gzip on/off, message size | CPU 사용량 증가 대비 네트워크 절감 효과 |
| 14 | Proxy / LB traversal | [14-proxy-lb-traversal](./scenarios/14-proxy-lb-traversal.md) | ingress, API gateway, service mesh를 거치는 경우 | proxy 0개/1개/다단 | 프록시 처리 비용, HTTP/2/gRPC 지원 품질 차이 |
| 15 | Server near saturation | [15-server-near-saturation](./scenarios/15-server-near-saturation.md) | 서버 CPU 또는 worker가 포화에 가까운 상태 | CPU limit, 동시 요청 수 | 포화 구간에서 latency 증가 패턴과 에러 발생 시점 |
| 16 | Mixed traffic | [16-mixed-traffic](./scenarios/16-mixed-traffic.md) | 작은 요청과 큰 요청이 섞여 있는 실제형 패턴 | small/large 비율, read/write 혼합 | 단일 패턴보다 실제 서비스에 가까운 체감 차이 |

## 우선순위 추천

처음에는 아래 순서로 보는 것이 좋다.

1. `Baseline small unary`
2. `Header-heavy request`
3. `Large request body / Large response body`
4. `High RPS from few clients`
5. `Many concurrent clients`
6. `Connection churn`
7. `Burst traffic`

## 추가 메모

- 단순히 `평균 latency`만 보면 차이가 작게 보일 수 있으므로 `p95`, `p99`를 같이 봐야 한다.
- `REST`가 `HTTP/1.1`인지 `HTTP/2`인지에 따라 결과 해석이 크게 달라질 수 있다.
- 실제 운영 환경과 유사하게 `TLS`, `LB`, `proxy`, `observability header` 포함 여부를 별도 케이스로 분리하는 것이 좋다.
- 가능하면 각 케이스마다 한 가지 변수만 크게 바꾸고 나머지는 고정해서 원인 해석이 가능하도록 한다.
