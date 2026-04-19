### Update the app
예제를 빌드하면(build), 빌드 과정에서 생성된 gRPC 클라이언트 및 서버 클래스가 포함된 GreeterGrpc.java 파일이 다시 생성됩니다.
또한 이 과정에서 요청(request)과 응답(response) 타입을 채우고(populating), 직렬화하고(serializing), 다시 읽어오는(retrieving) 데 필요한 클래스들도 함께 다시 생성됩니다.
하지만, 예제 애플리케이션에서 직접 작성한(hand-written) 코드 부분에는 여전히 새로운 메서드를 구현하고 호출해야 합니다.

### Update the server
