# S6. Proxy / CDN / LB 경유 Fetch

## 분류

별도 분류 케이스

## 별도 분리 이유

이 케이스는 middlebox, protocol downgrade, 캐시 정책, connection termination 정책이 함께 섞인다. 따라서 순수 protocol 비교와는 분리해야 한다.

## 목적

proxy, CDN, LB를 거치는 fetch 경로에서 실제 운영과 유사한 성능 특성을 확인한다.

## 적용 대상

- public CDN 다운로드
- internal gateway 경유 fetch
- service mesh 또는 ingress 뒤의 fetch API

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 경로 | direct, LB 1-hop, CDN/LB 2-hop |
| protocol mode | REST H1, REST H2, gRPC H2 |
| object 크기 | small, medium, large |
| cache 상태 | cold, warm |

## 설계 포인트

- direct baseline을 반드시 먼저 확보한다.
- middlebox가 `HTTP/2`를 유지하는지, terminate하는지 기록한다.
- header size 제한, stream 제한, idle timeout을 함께 정리한다.

## 수집 지표

- 전체 완료 시간
- hop별 지연 시간
- cache hit 여부
- proxy/LB CPU / Memory
- 에러율

## 수행 시점

- 운영 환경 재현 테스트 또는 배포 전 검증 단계에서 수행
