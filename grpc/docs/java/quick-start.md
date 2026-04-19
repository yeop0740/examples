### Update the gRPC service 
이 섹션에서는 추가적인 서버 메서드 하나를 추가하여 애플리케이션을 업데이트합니다.

gRPC 서비스는 protocol buffers 를 사용하여 정의됩니다.

서비스를 .proto 파일 안에서 어떻게 정의하는지 더 자세히 알고 싶다면 Basics tutorial 을 참고하면 됩니다.

지금 단계에서 알아두어야 할 것은 다음과 같습니다.

서버와 클라이언트 stub 양쪽 모두에 SayHello() RPC 메서드 가 있으며,

이 메서드는:

클라이언트로부터 HelloRequest 를 매개변수로 받고
서버로부터 HelloReply 를 반환합니다.

그리고 이 메서드는 다음과 같이 정의됩니다.
```proto
service Greeter {
    rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
    string name = 1;
}

message HelloReply {
    string message = 1;
}
```

src/main/proto/helloworld.proto 파일을 열고,
SayHello() 와 동일한 요청(request) 및 응답(response) 타입을 사용하는 새로운 SayHelloAgain() 메서드를 추가합니다.
```proto
service Greeter {
    rpc SayHello (HelloRequest) returns (HelloReply) {}
    rpc SayHelloAgain (HelloRequest) returns (HelloReply) {} // 새로운 메서드
}

message HelloRequest {
    string name = 1;
}

message HelloResponse {
    string message = 1;
}
```

### Update the app 

