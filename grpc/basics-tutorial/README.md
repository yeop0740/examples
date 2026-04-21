# Basics tutorial

이 튜토리얼은 Java 프로그래머를 위한 gRPC 사용의 기초적인 입문 안내를 제공합니다.

이 예제를 따라가면서 다음 내용을 배우게 됩니다.
- `.proto` 파일 안에서 서비스를 정의하는 방법
- protocol buffer compiler를 사용하여 서버 코드와 클라이언트 코드를 생성하는 방법
- Java gRPC API를 사용하여 서비스용 간단한 클라이언트와 서버를 작성하는 방법

이 튜토리얼은 Introduction to gRPC 를 이미 읽었고, protocol buffers 에 익숙하다는 것을 전제로 합니다.
또한 이 튜토리얼의 예제는 protocol buffers language의 proto3 버전을 사용합니다.
이에 대한 추가 내용은 다음 문서에서 확인할 수 있습니다.
- proto3 language guide
- Java generated code guide

## Why use gRPC? 
이 예제는 간단한 경로 매핑(route mapping) 애플리케이션입니다.
이 애플리케이션은 클라이언트가 다음과 같은 작업을 할 수 있도록 합니다.
- 자신의 경로(route)에 있는 feature 정보(예: 특정 지점 정보)를 조회하고
- 자신의 이동 경로에 대한 요약(summary)을 생성하며
- 교통 상황 업데이트와 같은 경로 정보를 서버 및 다른 클라이언트와 교환합니다.

gRPC를 사용하면 하나의 .proto 파일에서 서비스를 한 번 정의한 뒤,
gRPC가 지원하는 어떤 언어로든 클라이언트와 서버 코드를 생성할 수 있습니다.
이렇게 생성된 코드는 대규모 데이터센터 내부의 서버부터 개인 태블릿까지 다양한 환경에서 실행될 수 있으며, 서로 다른 언어와 실행 환경 사이의 통신에서 발생하는 복잡성은 gRPC가 대신 처리해 줍니다.

또한 protocol buffers를 사용함으로써 다음과 같은 장점도 얻을 수 있습니다.
- 효율적인 직렬화(efficient serialization)
- 단순한 IDL(Interface Definition Language)
- 쉬운 인터페이스 업데이트

## Example code and setup
https://github.com/grpc/grpc-java 의 코드를 활용

## Defining the service 
첫 번째 단계는 (Introduction to gRPC에서 이미 보았듯이)
protocol buffers를 사용하여 gRPC 서비스와 메서드의 요청(request) 및 응답(response) 타입을 정의하는 것입니다.
전체 .proto 파일은 `route-guide.proto` 파일에서 확인할 수 있습니다.

그리고 이 예제에서는 Java 코드를 생성할 것이므로, `.proto` 파일 안에 java_package 파일 옵션(file option) 을 지정했습니다.
```protobuf
option java_package = "io.grpc.examples.routeguide";
```

이 설정은 생성될 Java 클래스들에 사용할 package를 지정하는 것입니다.
`.proto` 파일 안에 명시적으로 `java_package` 옵션을 지정하지 않으면, 기본적으로는 proto package (`package` 키워드로 지정한 값)가 사용됩니다.

하지만 일반적으로 proto package는 좋은 Java package가 되지 않습니다.
그 이유는 proto package는 보통 reverse domain name 형식으로 시작하도록 설계되지 않기 때문입니다.

이 .proto 로 다른 언어의 코드를 생성한다면, `java_package` 옵션은 무시된다.

서비스를 정의하려면, `.proto` 파일 안에서 이름이 있는 `service` 를 선언합니다.

```protobuf
service RouteGuide {
//   ...
}
```

그 다음, service 정의 내부에 rpc 메서드들을 정의하고, 각 메서드의 요청(request) 타입과 응답(response) 타입을 지정합니다.
gRPC는 네 가지 종류의 service method 를 정의할 수 있도록 제공하며, 이 네 가지 모두가 RouteGuide 서비스 에서 사용됩니다.

- 클라이언트가 stub을 사용하여 서버에 요청을 보내고, 응답이 돌아올 때까지 기다리는 가장 단순한 형태의 RPC 입니다.
  이는 일반적인 함수 호출과 비슷하게 동작합니다.
```
rpc GetFeature(Point) returns (Feature) {}
```

- 클라이언트가 서버에 요청을 보내고, 그에 대한 응답으로 여러 개의 메시지를 순차적으로 읽을 수 있는 stream 을 받는 서버 측 스트리밍 RPC(Server-side streaming RPC) 입니다.
  클라이언트는 반환된 stream으로부터 메시지를 계속 읽다가, 더 이상 메시지가 없을 때까지 읽습니다.
  예제에서 볼 수 있듯이, 서버 측 스트리밍 메서드는 응답 타입(response type) 앞에 stream 키워드를 붙여서 지정합니다.
```
rpc ListFeatures(Rectangle) returns (stream Feature) {}
```

- 클라이언트가 제공된 stream을 사용하여 여러 개의 메시지를 순차적으로 작성하고 서버로 전송하는 클라이언트 측 스트리밍 RPC(Client-side streaming RPC) 입니다. 
  클라이언트는 모든 메시지 전송을 마친 뒤, 서버가 이 메시지들을 모두 읽고 응답을 반환할 때까지 기다립니다.
  클라이언트 측 스트리밍 메서드는 요청 타입(request type) 앞에 stream 키워드를 붙여서 지정합니다.
```
rpc RecordRoute(stream Point) returns (RouteSummary) {}
```

- 클라이언트와 서버 양쪽 모두가 읽기-쓰기 스트림(read-write stream) 을 사용하여 여러 개의 메시지를 주고받는 양방향 스트리밍 RPC(Bidirectional streaming RPC) 입니다.
  두 스트림은 서로 독립적으로 동작하므로, 클라이언트와 서버는 원하는 순서대로 메시지를 읽고 쓸 수 있습니다.
  예를 들어 서버는 클라이언트의 모든 메시지를 받은 뒤 응답을 보낼 수도 있고, 메시지 하나를 읽은 뒤 바로 메시지 하나를 보낼 수도 있으며, 또는 그 외 다양한 읽기/쓰기 조합을 사용할 수도 있습니다.
  각 스트림 내부에서는 메시지 순서가 유지됩니다.
  이 유형의 메서드는 요청 타입과 응답 타입 모두 앞에 stream 키워드를 붙여서 지정합니다.
```
rpc RouteChat(stream RouteNote) returns (stream RouteNote) {}
```

`.proto` 파일에는 서비스 메서드에서 사용되는 모든 요청(request) 및 응답(response) 타입에 대한 protocol buffer message type 정의도 포함되어 있습니다.
예를 들어, 다음은 Point 메시지 타입입니다.
```protobuf
message Point {
  int32 latitude = 1;
  int32 longitude = 2;
}
```

## Generating client and server code 
다음 단계로, .proto 에 정의한 서비스 정의(service definition)로부터 gRPC 클라이언트와 서버 인터페이스를 생성해야 합니다.
이 작업은 protocol buffer compiler인 protoc 와 특수한 gRPC Java plugin 을 사용하여 수행합니다.
gRPC 서비스를 생성하려면 반드시 proto3 compiler 를 사용해야 한다는 것입니다(proto3 compiler는 proto2,proto3 syntax 둘 다 지원합니다).

Gradle이나 Maven을 사용할 경우, protoc build plugin 이 빌드 과정의 일부로 필요한 코드를 자동 생성할 수 있습니다.
그리고 자신의 .proto 파일로 코드를 생성하는 방법은 grpc-java README 를 참고할 수 있습니다.

다음 클래스들은 우리의 서비스 정의(service definition)로부터 생성됩니다.
- Feature.java, Point.java, Rectangle.java 및 기타 클래스들 → 요청(request) 및 응답(response) 메시지 타입을 채우고(populate), 직렬화하고(serialize), 다시 읽어오는(retrieve)데 필요한 모든 protocol buffer 코드를 포함합니다.
- RouteGuideGrpc.java → 다음을 포함한 여러 유용한 코드가 생성됩니다.
  - 서버 측) RouteGuide 서버가 구현해야 하는 기본 클래스(base class - RouteGuideGrpc.RouteGuideImplBase) 이 클래스에는 RouteGuide 서비스에 정의된 모든 메서드가 포함됩니다.
    서버는 이를 상속하여 구현합니다.
  - 클라이언트 측) RouteGuide 서버와 통신하기 위해 사용할 수 있는 stub 클래스들

## Creating the server
먼저 RouteGuide 서버를 어떻게 만드는지 살펴보겠습니다.
만약 gRPC 클라이언트 생성에만 관심이 있다면, 이 섹션은 건너뛰고 바로 Creating the client 섹션으로 넘어가도 됩니다.
(그래도 이 부분도 흥미롭게 느껴질 수 있습니다!)

RouteGuide 서비스가 실제로 동작하도록 만들기 위해서는 두 가지가 필요합니다.
- 서비스 정의로부터 생성된 service base class를 오버라이드(override)하는 것
  → 즉, 서비스의 실제 작업(actual “work”)을 구현하는 부분입니다.
- 클라이언트의 요청을 받아들이고 서비스 응답을 반환할 수 있도록 gRPC 서버를 실행하는 것

예제 RouteGuide 서버는 `RouteGuideServer.java` 파일에서 확인할 수 있습니다.
이제 이 코드가 어떻게 동작하는지 좀 더 자세히 살펴보겠습니다.

### Implementing RouteGuide 
보시는 것처럼, 우리의 서버에는 RouteGuideService 클래스가 있으며, 이 클래스는 생성된 RouteGuideGrpc.RouteGuideImplBase 추상 클래스(abstract class) 를 상속합니다.

```java
private static class RouteGuideService extends RouteGuideGrpc.RouteGuideImplBase {
// ...
}
```

#### Simple RPC 
RouteGuideService 는 우리가 정의한 모든 서비스 메서드를 구현합니다.
먼저 가장 단순한 메서드인 GetFeature() 를 살펴보겠습니다.
GetFeature() 는 클라이언트로부터 Point 를 받아서, 서버의 데이터베이스에서 해당 위치에 대응하는 feature 정보를 찾아 Feature 로 반환합니다.

```java
@Override
public void getFeature(Point request, StreamObserver<Feature> responseObserver) {
  responseObserver.onNext(checkFeature(request));
  responseObserver.onCompleted();
}

// ...

private Feature checkFeature(Point location) {
  for (Feature feature : features) {
    if (feature.getLocation().getLatitude() == location.getLatitude()
        && feature.getLocation().getLongitude() == location.getLongitude()) {
      return feature;
    }
  }

  // No feature was found, return an unnamed feature.
  return Feature.newBuilder().setName("").setLocation(location).build();
}
```

getFeature() 메서드는 두 개의 파라미터를 받습니다.
- Point → 요청(request)
- StreamObserver<Feature> → 응답 observer(response observer)이며, 서버가 자신의 응답을 전달할 때 사용하는 특별한 인터페이스입니다.

클라이언트에게 응답을 반환하고 호출을 완료하려면 다음과 같이 합니다.
1. 서비스 정의에 명시된 대로, 클라이언트에게 반환할 Feature 응답 객체를 생성하고 필요한 값을 채웁니다(populate).
   이 예제에서는 이를 별도의 private 메서드인 checkFeature() 에서 수행합니다.
2. response observer의 onNext() 메서드를 사용하여 Feature 를 클라이언트에 반환합니다.
3. response observer의 onCompleted() 메서드를 사용하여 해당 RPC 처리가 끝났음을 알립니다.

#### Server-side streaming RPC 
다음으로는 우리의 스트리밍 RPC 중 하나를 살펴보겠습니다.
ListFeatures 는 서버 측 스트리밍 RPC(server-side streaming RPC) 이므로, 클라이언트에게 여러 개의 Feature 를 반환해야 합니다.

```java
private final Collection<Feature> features;

// ...

@Override
public void listFeatures(Rectangle request, StreamObserver<Feature> responseObserver) {
  int left = min(request.getLo().getLongitude(), request.getHi().getLongitude());
  int right = max(request.getLo().getLongitude(), request.getHi().getLongitude());
  int top = max(request.getLo().getLatitude(), request.getHi().getLatitude());
  int bottom = min(request.getLo().getLatitude(), request.getHi().getLatitude());

  for (Feature feature : features) {
    if (!RouteGuideUtil.exists(feature)) {
      continue;
    }

    int lat = feature.getLocation().getLatitude();
    int lon = feature.getLocation().getLongitude();
    if (lon >= left && lon <= right && lat >= bottom && lat <= top) {
      responseObserver.onNext(feature);
    }
  }
  responseObserver.onCompleted();
}
```

Simple RPC와 마찬가지로, 이 메서드도 다음 두 가지를 받습니다.
- 요청 객체(request object) → 여기서는 클라이언트가 Feature를 찾고자 하는 범위를 나타내는 Rectangle
- StreamObserver 응답 observer

이번에는 클라이언트에게 반환해야 하는 만큼의 Feature 객체들을 모두 가져옵니다.
이 예제에서는 서비스의 feature collection 중에서, 요청으로 받은 Rectangle 내부에 포함되는 것들을 선택합니다.
그리고 선택된 각 Feature 를 순서대로 response observer의 onNext() 메서드를 사용하여 하나씩 기록(write)합니다.
마지막으로, Simple RPC와 마찬가지로 response observer의 onCompleted() 메서드를 사용하여 gRPC에 응답 작성이 끝났음을 알립니다.

#### Client-side streaming RPC 

이제 조금 더 복잡한 것을 살펴보겠습니다. 클라이언트 측 스트리밍 메서드인 RecordRoute() 입니다.
이 메서드에서는 클라이언트로부터 Point 들의 stream 을 받고, 그 이동 경로(trip)에 대한 정보를 담은 하나의 RouteSummary 를 반환합니다.

```java
@Override
public StreamObserver<Point> recordRoute(final StreamObserver<RouteSummary> responseObserver) {
  return new StreamObserver<Point>() {
    int pointCount;
    int featureCount;
    int distance;
    Point previous;
    long startTime = System.nanoTime();

    @Override
    public void onNext(Point point) {
      pointCount++;
      if (RouteGuideUtil.exists(checkFeature(point))) {
        featureCount++;
      }
      // For each point after the first, add the incremental distance from the previous point
      // to the total distance value.
      if (previous != null) {
        distance += calcDistance(previous, point);
      }
      previous = point;
    }

    @Override
    public void onError(Throwable t) {
      logger.log(Level.WARNING, "Encountered error in recordRoute", t);
    }

    @Override
    public void onCompleted() {
      long seconds = NANOSECONDS.toSeconds(System.nanoTime() - startTime);
      responseObserver.onNext(RouteSummary.newBuilder().setPointCount(pointCount)
          .setFeatureCount(featureCount).setDistance(distance)
          .setElapsedTime((int) seconds).build());
      responseObserver.onCompleted();
    }
  };
}
```
보시는 것처럼, 이전 메서드들과 마찬가지로 이 메서드도 StreamObserver 응답 observer 파라미터를 받습니다.
하지만 이번에는 클라이언트가 자신의 Point 들을 기록(write)할 수 있도록 StreamObserver 를 반환합니다.

메서드 본문에서는 반환할 익명 StreamObserver(anonymous StreamObserver) 를 생성합니다.
그리고 그 안에서 다음을 수행합니다.

- onNext() 메서드를 오버라이드하여, 클라이언트가 메시지 스트림에 Point 를 쓸 때마다 feature 및 기타 정보를 가져옵니다.
- onCompleted() 메서드를 오버라이드하여(클라이언트가 메시지 작성을 모두 끝냈을 때 호출됨) RouteSummary를 채우고(populate) 생성(build)합니다.
  이 메서드가 가지고 있는 response observer의 onNext() 를 호출하여 RouteSummary 를 반환하고, 이어서 onCompleted() 를 호출하여 서버 측에서 호출을 종료합니다.


#### Bidirectional streaming RPC 
마지막으로, 양방향 스트리밍 RPC인 RouteChat()을 살펴본다.

```java
@Override
public StreamObserver<RouteNote> routeChat(final StreamObserver<RouteNote> responseObserver) {
  return new StreamObserver<RouteNote>() {
    @Override
    public void onNext(RouteNote note) {
      List<RouteNote> notes = getOrCreateNotes(note.getLocation());

      // Respond with all previous notes at this location.
      for (RouteNote prevNote : notes.toArray(new RouteNote[0])) {
        responseObserver.onNext(prevNote);
      }

      // Now add the new note to the list
      notes.add(note);
    }

    @Override
    public void onError(Throwable t) {
      logger.log(Level.WARNING, "Encountered error in routeChat", t);
    }

    @Override
    public void onCompleted() {
      responseObserver.onCompleted();
    }
  };
}
```

클라이언트 측 스트리밍 예제와 마찬가지로, 이번에도 StreamObserver 응답 observer를 전달받고, 동시에 StreamObserver 를 반환합니다.
다만 이번에는, 클라이언트가 자신의 메시지 스트림에 계속 메시지를 쓰고 있는 동안에도 서버가 메서드의 response observer를 통해 값을 반환합니다.
여기서 읽기(read)와 쓰기(write)의 문법은 클라이언트 스트리밍과 서버 스트리밍 메서드에서 사용한 것과 완전히 동일합니다.
또한 각 측은 상대방이 보낸 메시지를 작성된 순서대로 항상 받게 되지만, 클라이언트와 서버는 원하는 순서대로 읽고 쓸 수 있습니다.
양방향 스트리밍에서는 순서는 보장되지만, 송수신 타이밍은 서로 완전히 독립적입니다.


### Starting the server 
모든 메서드 구현을 마친 후에는,
클라이언트가 실제로 우리의 서비스를 사용할 수 있도록 gRPC 서버를 시작(start up) 해야 합니다.

다음 코드는 RouteGuide 서비스에 대해 이를 수행하는 방법을 보여줍니다.
```java
public RouteGuideServer(int port, URL featureFile) throws IOException {
  this(ServerBuilder.forPort(port), port, RouteGuideUtil.parseFeatures(featureFile));
}

/** Create a RouteGuide server using serverBuilder as a base and features as data. */
public RouteGuideServer(ServerBuilder<?> serverBuilder, int port, Collection<Feature> features) {
  this.port = port;
  server = serverBuilder.addService(new RouteGuideService(features))
      .build();
}
//...
public void start() throws IOException {
  server.start();
  logger.info("Server started, listening on " + port);
// ...
}
```

보시는 것처럼, 우리는 ServerBuilder 를 사용하여 서버를 생성(build)하고 시작(start)합니다.
이를 위해 다음과 같은 작업을 수행합니다.
1. builder의 forPort() 메서드를 사용하여
   클라이언트 요청을 받을 주소(address)와 포트(port)를 지정합니다.
2. 서비스 구현 클래스인 RouteGuideService 의 인스턴스를 생성한 뒤,
   builder의 addService() 메서드에 전달합니다.
3. builder에 대해 build() 와 start() 를 호출하여
   우리의 서비스를 위한 RPC 서버를 생성하고 시작합니다.


## Creating the client 
이 섹션에서는 RouteGuide 서비스용 클라이언트를 만드는 방법을 살펴봅니다.
전체 예제 클라이언트 코드는 `RouteGuideClient.java` 코드 에서 확인할 수 있습니다.

### Instantiating a stub
서비스 메서드를 호출하려면, 먼저 stub 을 생성해야 합니다. 정확히는 두 종류의 stub 을 생성합니다.
- blocking / synchronous stub
  → RPC 호출이 서버의 응답이 올 때까지 기다립니다.
  그리고 응답을 반환하거나, 예외(exception)를 발생시킵니다.
- non-blocking / asynchronous stub
  → 서버에 대해 non-blocking 방식으로 호출을 수행하며,
  응답은 비동기적으로 반환됩니다. 또한 일부 streaming 호출은 비동기 stub을 통해서만 수행할 수 있습니다.

먼저 stub을 만들기 위해 gRPC channel 을 생성해야 합니다. 이때 연결할 서버 주소(address) 와 포트(port) 를 지정합니다.
```java
public RouteGuideClient(String host, int port) {
  this(ManagedChannelBuilder.forAddress(host, port).usePlaintext());
}

/** Construct client for accessing RouteGuide server using the existing channel. */
public RouteGuideClient(ManagedChannelBuilder<?> channelBuilder) {
  channel = channelBuilder.build();
  blockingStub = RouteGuideGrpc.newBlockingStub(channel);
  asyncStub = RouteGuideGrpc.newStub(channel);
}
```

channel을 생성하기 위해 `ManagedChannelBuilder` 를 사용합니다.

이제 생성한 channel을 사용하여 stub을 만들 수 있습니다.
이는 .proto 로부터 생성된 RouteGuideGrpc 클래스가 제공하는 newStub 과 newBlockingStub 메서드를 사용하여 수행합니다.
```java
blockingStub = RouteGuideGrpc.newBlockingStub(channel);
asyncStub = RouteGuideGrpc.newStub(channel);
```

### Calling service methods
service method를 어떻게 호출할 수 있는지 살펴본다.

#### Simple RPC
blocking stub에서 단순 RPC인 GetFeature 를 호출하는 것은 로컬 메서드를 호출하는 것만큼 간단합니다.

```java
Point request = Point.newBuilder().setLatitude(lat).setLongitude(lon).build();
Feature feature;
try {
  feature = blockingStub.getFeature(request);
} catch (StatusRuntimeException e) {
  logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
  return;
}
```

요청용 protocol buffer 객체(이 예제에서는 Point)를 생성하고 필요한 값을 채운 뒤, 이를 blocking stub의 getFeature() 메서드에 전달하면, 결과로 Feature 를 반환받습니다.

그리고 오류가 발생하면, 오류는 Status 형태로 인코딩되어 전달됩니다. 이때 Java에서는 StatusRuntimeException 으로 받을 수 있으며, 그 안에서 Status 를 꺼낼 수 있습니다.

#### Server-side streaming RPC
다음으로, 지리적 Feature들의 stream을 반환하는 서버 측 스트리밍 호출인 ListFeatures 를 살펴보겠습니다.

```java
Rectangle request =
    Rectangle.newBuilder()
        .setLo(Point.newBuilder().setLatitude(lowLat).setLongitude(lowLon).build())
        .setHi(Point.newBuilder().setLatitude(hiLat).setLongitude(hiLon).build()).build();
Iterator<Feature> features;
try {
  features = blockingStub.listFeatures(request);
} catch (StatusRuntimeException e) {
  logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
  return;
}
```

보시는 것처럼, 이것은 방금 살펴본 단순 RPC와 매우 비슷합니다.
다만, 하나의 Feature 를 반환하는 대신, 클라이언트가 반환된 모든 Feature 를 읽을 수 있도록 Iterator 를 반환한다는 점이 다릅니다.

#### Client-side streaming RPC 
이제 조금 더 복잡한 것을 살펴보겠습니다.
클라이언트 측 스트리밍 메서드인 RecordRoute 입니다.

이 메서드에서는 Point 들의 stream을 서버로 보내고, 그 결과로 하나의 RouteSummary 를 반환받습니다.
이 메서드에서는 비동기 stub(asynchronous stub) 을 사용해야 합니다.
만약 이미 Creating the server 섹션을 읽었다면, 여기 내용 중 일부는 매우 익숙하게 느껴질 수 있습니다.
왜냐하면 비동기 스트리밍 RPC는 클라이언트와 서버 양쪽에서 비슷한 방식으로 구현되기 때문입니다.

```java
public void recordRoute(List<Feature> features, int numPoints) throws InterruptedException {
  info("*** RecordRoute");
  final CountDownLatch finishLatch = new CountDownLatch(1);
  StreamObserver<RouteSummary> responseObserver = new StreamObserver<RouteSummary>() {
    @Override
    public void onNext(RouteSummary summary) {
      info("Finished trip with {0} points. Passed {1} features. "
          + "Travelled {2} meters. It took {3} seconds.", summary.getPointCount(),
          summary.getFeatureCount(), summary.getDistance(), summary.getElapsedTime());
    }

    @Override
    public void onError(Throwable t) {
      Status status = Status.fromThrowable(t);
      logger.log(Level.WARNING, "RecordRoute Failed: {0}", status);
      finishLatch.countDown();
    }

    @Override
    public void onCompleted() {
      info("Finished RecordRoute");
      finishLatch.countDown();
    }
  };

  StreamObserver<Point> requestObserver = asyncStub.recordRoute(responseObserver);
  try {
    // Send numPoints points randomly selected from the features list.
    Random rand = new Random();
    for (int i = 0; i < numPoints; ++i) {
      int index = rand.nextInt(features.size());
      Point point = features.get(index).getLocation();
      info("Visiting point {0}, {1}", RouteGuideUtil.getLatitude(point),
          RouteGuideUtil.getLongitude(point));
      requestObserver.onNext(point);
      // Sleep for a bit before sending the next one.
      Thread.sleep(rand.nextInt(1000) + 500);
      if (finishLatch.getCount() == 0) {
        // RPC completed or errored before we finished sending.
        // Sending further requests won't error, but they will just be thrown away.
        return;
      }
    }
  } catch (RuntimeException e) {
    // Cancel RPC
    requestObserver.onError(e);
    throw e;
  }
  // Mark the end of requests
  requestObserver.onCompleted();

  // Receiving happens asynchronously
  finishLatch.await(1, TimeUnit.MINUTES);
}
```

보시는 것처럼, 이 메서드를 호출하려면 먼저 StreamObserver 를 생성해야 합니다.
이 StreamObserver 는 서버가 RouteSummary 응답을 전달할 때 호출할 수 있도록 하는 특별한 인터페이스를 구현합니다.
그리고 이 StreamObserver 안에서 다음을 수행합니다.
- `onNext()` 메서드를 오버라이드하여,
서버가 메시지 스트림에 RouteSummary 를 쓸 때 반환된 정보를 출력합니다.
- `onCompleted()` 메서드를 오버라이드하여(서버가 자신의 쪽에서 호출을 완료했을 때 호출됨)
  서버가 쓰기를 끝냈는지 확인할 수 있도록 CountDownLatch 를 감소시킵니다.

그 다음, 생성한 StreamObserver 를 비동기 stub의 recordRoute() 메서드에 전달하고, 서버로 보낼 Point 들을 작성(write)하기 위한 우리 자신의 StreamObserver request observer 를 반환받습니다.
모든 point 전송이 끝나면, 클라이언트 측 쓰기가 끝났음을 gRPC에 알리기 위해 request observer의 `onCompleted()` 를 호출합니다.
그 후에는 서버 측 처리 완료 여부를 확인하기 위해 CountDownLatch 를 검사합니다.

#### Bidirectional streaming RPC 

마지막으로, 양방향 스트리밍 RPC인 RouteChat() 을 살펴보겠습니다.

```java
public void routeChat() throws Exception {
  info("*** RoutChat");
  final CountDownLatch finishLatch = new CountDownLatch(1);
  StreamObserver<RouteNote> requestObserver =
      asyncStub.routeChat(new StreamObserver<RouteNote>() {
        @Override
        public void onNext(RouteNote note) {
          info("Got message \"{0}\" at {1}, {2}", note.getMessage(), note.getLocation()
              .getLatitude(), note.getLocation().getLongitude());
        }

        @Override
        public void onError(Throwable t) {
          Status status = Status.fromThrowable(t);
          logger.log(Level.WARNING, "RouteChat Failed: {0}", status);
          finishLatch.countDown();
        }

        @Override
        public void onCompleted() {
          info("Finished RouteChat");
          finishLatch.countDown();
        }
      });

  try {
    RouteNote[] requests =
        {newNote("First message", 0, 0), newNote("Second message", 0, 1),
            newNote("Third message", 1, 0), newNote("Fourth message", 1, 1)};

    for (RouteNote request : requests) {
      info("Sending message \"{0}\" at {1}, {2}", request.getMessage(), request.getLocation()
          .getLatitude(), request.getLocation().getLongitude());
      requestObserver.onNext(request);
    }
  } catch (RuntimeException e) {
    // Cancel RPC
    requestObserver.onError(e);
    throw e;
  }
  // Mark the end of requests
  requestObserver.onCompleted();

  // Receiving happens asynchronously
  finishLatch.await(1, TimeUnit.MINUTES);
}
```

클라이언트 측 스트리밍 예제와 마찬가지로, 이번에도 StreamObserver 응답 observer를 전달받고, 동시에 StreamObserver 를 반환합니다.
다만 이번에는, 서버가 자신의 메시지 스트림에 계속 메시지를 쓰고 있는 동안에도 우리 메서드의 response observer를 통해 값을 보냅니다.

여기서 읽기(read)와 쓰기(write)의 문법은 클라이언트 스트리밍 메서드와 완전히 동일합니다.

또한 각 측은 상대방이 보낸 메시지를 작성된 순서대로 항상 받게 되지만, 클라이언트와 서버는 원하는 순서대로 읽고 쓸 수 있습니다.

## Try it out! 
클라이언트와 서버를 빌드하고 실행하려면, 예제 디렉터리의 README에 있는 안내를 따르십시오.
