# F3. Single File Multithread Fetch for Java + k6

## 목적

하나의 큰 파일을 여러 chunk로 병렬 fetch 할 때 `REST`와 `gRPC`의 전송 효율을 비교한다.

## Java 서버 설계

- REST: `GET /files/{id}` with `Range` header 또는 `GET /files/{id}/chunks/{index}`
- gRPC: `GetFileChunk(FileChunkRequest) returns (FileChunkResponse)` 또는 server streaming
- 파일 데이터는 메모리 또는 동일 storage adapter에서 읽는다.
- chunk checksum을 반환해 merge 검증이 가능하도록 한다.

## k6 설계

- executor: `per-vu-iterations`
- 1 iteration은 "파일 1개 전체 fetch 완료"로 정의한다.
- REST 병렬 fetch는 `http.batch()` 사용
- gRPC 병렬 fetch는 `Client.asyncInvoke()` 또는 다중 `Stream` 사용
- k6의 VU는 single-threaded이므로 JVM client의 실제 multithreading과 1:1 동일하지 않다는 점을 결과에 명시한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| 파일 크기 | `100MB`, `1GB`, `5GB` |
| chunk size | `256KB`, `1MB`, `4MB`, `16MB` |
| 병렬도 | `1`, `2`, `4`, `8`, `16`, `32` |
| 방식 | REST range, REST chunk API, gRPC unary chunk, gRPC streaming |

## 실행 포인트

- 병렬도 1을 baseline으로 잡는다.
- chunk merge 시간은 별도 metric으로 기록한다.
- `http.batch()`의 batch 제한과 gRPC 동시 stream 수를 동일 수준으로 맞춘다.

## 판정 포인트

- 총 다운로드 완료 시간
- 병렬도 증가 대비 throughput 증가폭
- chunk merge 비용 포함 전체 효율

## 주의사항

- 이 케이스는 `k6`로 충분히 근사 가능하지만, "JVM client의 실제 multithread scheduler 비용"까지 보려면 Java client harness를 별도 보조 실험으로 두는 편이 낫다.
