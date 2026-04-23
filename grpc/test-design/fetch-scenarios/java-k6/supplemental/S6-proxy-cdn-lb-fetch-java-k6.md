# S6. Proxy / CDN / LB Fetch for Java + k6

## 분류

별도 분리 케이스

## 목적

proxy, CDN, LB를 경유할 때 Java 서버의 fetch 경로가 실제 운영 환경에서 어떻게 달라지는지 확인한다.

## Java 서버 설계

- direct endpoint와 proxied endpoint를 모두 준비한다.
- ingress/gateway에서 `HTTP/2` 유지 여부와 gRPC pass-through 여부를 기록한다.
- timeout, max stream, header size limit을 명시적으로 고정한다.

## k6 설계

- direct와 proxied를 별도 scenario로 실행한다.
- REST는 `res.proto`를 기록해 실제 protocol을 확인한다.
- gRPC는 connect 대상이 LB인지 direct인지 태그로 분리한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 경로 | direct, LB 1-hop, gateway 2-hop |
| cache 상태 | cold, warm |
| object 크기 | small, medium, large |

## 주의사항

- middlebox에서 protocol downgrade가 일어나면 pure transport 비교가 아니다.
