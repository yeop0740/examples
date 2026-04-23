# S1. Server Streaming Fetch

## 분류

별도 분류 케이스

## 별도 분리 이유

이 케이스는 `단순 fetch`라기보다 `streaming 설계`의 영향을 크게 받는다. 따라서 unary 중심 비교 결과와 직접 섞어서 해석하면 왜곡될 가능성이 높다.

## 목적

대량 데이터를 여러 응답 chunk로 연속 전달할 때 `REST API`와 `gRPC server streaming`의 효율 차이를 별도로 측정한다.

## 적용 대상

- 대용량 목록 스트리밍 조회
- chunk 단위 파일 전송
- 장시간 이어지는 결과 전송

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 총 전송량 | `10MB`, `100MB`, `1GB` |
| stream chunk 크기 | `64KB`, `256KB`, `1MB` |
| 소비 속도 | fast consumer, slow consumer |
| protocol mode | REST chunked/streamed response, gRPC server streaming |

## 설계 포인트

- unary fetch와는 별도 benchmark로 수행한다.
- backpressure와 flow control을 반드시 기록한다.
- 소비자 처리 속도가 느릴 때의 메모리 증가와 지연을 측정한다.

## 수집 지표

- 총 완료 시간
- stream throughput
- 메모리 사용량
- backpressure 발생 여부
- stream 중단/오류율

## 수행 시점

- unary fetch 비교가 끝난 뒤 별도 라운드에서 수행
- file/large list 전송 모델을 검토할 때 우선 수행
