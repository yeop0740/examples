## Argo CD

### installation


```shell
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

argo cd cli 설치
```shell
brew install argocd
```

argo cd 접근

port forwarding
```shell
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

초기 admin 계정 비밀 번호 확인
cli로 확인하거나 `argocd-initial-admin-secret` 리소스에서 확인할 수 있음
```shell
argocd admin initial-password -n argocd
k get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
```

argo cd 서버에 로그인
```shell
argocd login 127.0.0.1:8080
```

비밀 번호 변경
8자 이상 32자 이하 조건이 있는 듯
```shell
argocd account update-password
```

로컬에서는 제공되는 기본 예제를 사용하도록 한다.

```shell
argocd app create guestbook \
#   --app-namespace app \
  --repo https://github.com/argoproj/argocd-example-apps.git \
  --path guestbook \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace app
```

위의 명령어를 실행하면 argocd가 관리하는 대상으로 guestbook 앱이 등록된다.
하지만, 실제로 생성되지는 않는다.
추가적인 명령을 실행하여 실제 리소스를 생성할 수 있다.

앞서 port-forwarding 했던 곳으로 접속하여 UI 환경으로 설정할 수 있다.
혹은 cli를 이용하여 sync 하도록 구성할 수 있다.

```shell
argocd app create nginx \
  --repo https://github.com/yeop0740/argocd-tutorial.git \
  --path nginx/alpha \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace app
```

```shell
argocd app sync nginx
```

nginx 서비스에 대한 port-forwarding
```shell
k port-forwarding svc/nginx -n app -p 3001:80
```

이후 브라우저에서 3001 포트로 접근 시 nginx 기본 페이지 확인 가능

nginx의 이미지 버전을 변경한 뒤, git에 반영하면 argocd가 자동으로 변경 사항을 감지한다.
초기 세팅으로는 바로 sync하지 않는다.

```shell
argocd app set nginx --sync-policy automated
```