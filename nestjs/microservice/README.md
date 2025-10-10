## 실행
```shell
docker compose build --no-cache
```

```shell
# docker compose up -d --scale <service_name>=<number_of_container>
docker compose up -d --scale summary=3
```

```shell
 # docker compsoe logs <service_name>
 docker compose logs summary
```

## 주의할 점
scale out 을 위해 docker compose file 에서 container_name 을 사용하여 custom service name 을 사용할 수 없다.
custom service name 을 사용하면 해당 서비스에 대해 컨테이너 이름을 모두 동일한 것으로 사용하게 되는데, 컨테이너 마다 유니크한 이름을 가져야 하기 때문이다.

## 결론
pub/sub 을 이용할 때는 topic 을 구독하는 모든 process 에서 topic 을 가져와 소비한다.
즉, 각각의 process 에서 동일한 작업을 중복으로 수행한다. 따라서 동일한 역할을 하는 process(container) 수가 많아지면, 해당 수만큼 동일 작업이 수행된다.
위에서 3 개의 container 를 생성하였으므로 3 번 동일 작업이 수행되었다.
