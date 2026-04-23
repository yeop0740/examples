# S1. Server Streaming Fetch for Java + k6

## 분류

별도 분리 케이스

## 목적

대량 데이터를 stream으로 전달할 때 Java 서버의 `REST streaming`과 `gRPC server streaming` 성능을 비교한다.

## Java 서버 설계

- REST: chunked response 또는 NDJSON streaming endpoint
- gRPC: `StreamFileChunks` 또는 `ListRecordsStream`
- 느린 consumer 상황을 만들 수 있도록 server-side flow control 로그를 남긴다.

## k6 설계

- k6 `Stream` API를 사용한다.
- 1 iteration은 stream 1회 소비 완료로 정의한다.
- consumer speed를 빠름/느림 두 가지로 나눈다.
- unary benchmark와 혼합하지 않고 별도 summary를 만든다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 총 전송량 | `10MB`, `100MB`, `1GB` |
| chunk 크기 | `64KB`, `256KB`, `1MB` |
| consumer 속도 | fast, slow |

## 주의사항

- 이 케이스는 transport 비교보다 flow control과 streaming 설계 영향이 더 크다.
