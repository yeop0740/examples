# k8s java client demo

- 현재 등록된 리소스
- Root CA 등록하는 기능(어드민 페이지에서) -> java cacert 파일에 추가하는 방법 -> 모든 파드에 적용하기 어려움..
  - configmap 혹은 secret 으로 등록해서 강제 rollout 하는 방법 있을 듯...
- /etc/hosts 변경하는 기능 추가 -> deployment 부분에서 조절 가능
 
### 필요한 작업
- [x] 등록하는 도메인에 대한 httproute 생성
- [x] 등록되어 있는 httproute 삭제

- cert file, key file 을 이용하여 tls secret 생성, 수정, 삭제
  - [x] file 분리
  - [ ] file 로딩(object storage)
  - [x] tls secret 생성
  - [x] tls secret 수정
  - [x] tls secret 삭제
- [x] tls secret 을 참조하는 gateway 리소스 수정(추가 및 삭제)

- [x] etc/hosts 에 도메인 추가 명령어
- [ ] 서버 실행되는 deployment에 임의의 a 레코드 추가 api

```shell
sudo sh -c 'printf "\n127.0.0.1 <domain-name>\n" >> /etc/hosts'
```

### 궁금

```java
private static String HTTPS_LISTENERS_NAME = "https-";

public void removeListeners(String gatewayName) {
    client.resources(Gateway.class)
            .inNamespace("default")
            .withName(gatewayName)
            .edit(g -> new GatewayBuilder(g)
                    .editOrNewSpec()
                    .withListeners(g.getSpec().getListeners().stream()
                            .filter(l -> !l.getName().equals(HTTPS_LISTENER_NAME))
                            .toList())
                    .endSpec()
                    .build());
}
```

위의 코드로 실행하면 아래의 에러가 발생
```shell
Message: Operation cannot be fulfilled on gateways.gateway.networking.k8s.io "hello-world": the object has been modified; please apply your changes to the latest version and try again. Received status: Status(apiVersion=v1, code=409, details=StatusDetails(causes=[], group=gateway.networking.k8s.io, kind=gateways, name=hello-world, retryAfterSeconds=null, uid=null, additionalProperties={}), kind=Status, message=Operation cannot be fulfilled on gateways.gateway.networking.k8s.io "hello-world": the object has been modified; please apply your changes to the latest version and try again, metadata=ListMeta(_continue=null, remainingItemCount=null, resourceVersion=null, selfLink=null, additionalProperties={}), reason=Conflict, status=Failure, additionalProperties={}).
```
list의 forEach를 사용하여 list의 원소를 delete 하는 것과 동일한 상황인지,
혹은 edit 안에서의 람다가 진행되며 기등록된 gateway를 업데이트를 진행하여 version이 바뀐건지(낙관적 락 시스템을 사용하는 것으로 보임)
