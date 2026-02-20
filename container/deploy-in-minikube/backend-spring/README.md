# TODO app

```shell
docker build -t backend-spring:0.0.1 . \
&& minikube image load backend-spring:0.0.1 \
&& kdel -f backend-spring.yaml \
&& kaf backend-spring.yaml
```

```shell
docker build -t backend-spring:0.0.1 . && \
kind load docker-image backend-spring:0.0.1 --name kind && \
k rollout restart deployment backend-spring
```
