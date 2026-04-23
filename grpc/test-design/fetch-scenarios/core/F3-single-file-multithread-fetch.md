# F3. Single File Multithread Fetch

## 목적

하나의 파일 또는 하나의 큰 논리 객체를 여러 chunk로 나눠 병렬 fetch 할 때 `REST API`와 `gRPC`의 전송 효율과 병렬 처리 비용을 비교한다.

## 적용 대상

- range 기반 다운로드
- 블록/청크 단위 객체 조회
- 대용량 파일 분할 읽기

## 고정 조건

- 동일 파일 데이터 사용
- 동일 chunk 병합 방식 사용
- 동일 thread pool 구현 사용
- retry와 cache는 기본 비활성화

## 테스트 데이터 설계

| 항목 | 값 |
| --- | --- |
| 파일 크기 | `100MB`, `1GB`, `5GB` |
| 파일 유형 | text-heavy, binary-like |
| 정렬/재조립 방식 | chunk index 기준 merge |

## 주요 변수

| 항목 | 값 |
| --- | --- |
| chunk size | `256KB`, `1MB`, `4MB`, `16MB` |
| thread 수 | `1`, `2`, `4`, `8`, `16`, `32` |
| protocol mode | REST range fetch, gRPC chunk fetch |
| 연결 방식 | shared connection/channel, separate connection |

## 실행 절차

1. 동일 파일을 정해진 chunk 크기로 분할한다.
2. 각 thread가 할당된 chunk를 병렬 조회한다.
3. 모든 chunk 수신 후 순서대로 merge한다.
4. thread 수와 chunk size를 바꾸며 반복 측정한다.
5. `1 thread` 결과를 baseline으로 함께 기록한다.

## 수집 지표

- 총 다운로드 완료 시간
- 평균 throughput
- chunk별 latency 분포
- 클라이언트 CPU / Memory 사용량
- merge 단계 소요 시간
- 에러율

## 해석 포인트

- protocol 차이뿐 아니라 chunk merge 비용과 thread pool overhead가 같이 반영된다.
- thread 수 증가가 선형적으로 throughput을 올리지 않는 구간을 찾는 것이 중요하다.
- `REST range`와 `gRPC chunk API`는 인터페이스 성격이 다를 수 있으므로 응답 의미를 동일하게 맞춰야 한다.

## 추가 확인 사항

- 큰 파일 1개와 중간 파일 여러 개의 상대 효율 비교
- TLS on/off에 따른 throughput 차이
- packet loss 환경에서 부분 실패 복구 비용 비교
