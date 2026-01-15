# Kubeconfig 관리 가이드

Kubernetes 클러스터 접근 권한을 관리하는 Kubeconfig 설정 방법에 대해 다룹니다.
이 가이드는 Kubeconfig의 기본 구조를 이해하고, **단일 Config 파일**과 **여러 Config 파일**을 사용하는 방법을 설명합니다.

---

## 개인적인 사용법

1. 기본 config 파일인 ${HOME}/.kube/config 파일 내에 새로운 접근 정보(user, cluster, context)를 추가합니다(nks 의 kubeconfig 파일 등에 첨부된 데이터).
2. `kubectl config use-context <context-name>` 명령을 이용하여 기본 context 를 설정한 뒤 사용합니다.

위의 방식대로 사용하면 추가적인 namespace 지정이 필요하지 않고, context 지정도 필요하지 않아 반복되는 플래그를 입력하지 않아도 되어 선호하는 편입니다.

---

## 1. config 구성 확인하기

config 파일은 Kubernetes 클러스터에 접근하기 위한 정보를 담고 있는 YAML 파일입니다. 크게 세 가지 핵심 요소를 살펴봅니다.
[기본 설정 파일의 경로](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/#the-kubeconfig-environment-variable)는 `${HOME}/.kube/config` 입니다.

### 구성 요소

1.  **Clusters (`clusters`)**
    *   **역할**: 접속할 Kubernetes 클러스터의 위치와 정보를 정의합니다.
    *   **포함 정보**: API 서버 주소(`server`), CA 인증서(`certificate-authority-data` 또는 파일 경로), 클러스터 이름.
2.  **Users (`users`)**
    *   **역할**: 클러스터에 접근하는 사용자의 인증 정보를 정의합니다.
    *   **포함 정보**: 클라이언트 인증서/키, 베어러 토큰(Bearer Token), 또는 사용자 이름/비밀번호 등.
3.  **Contexts (`contexts`)**
    *   **역할**: `Cluster`와 `User`를 연결하는 매핑 정보입니다. 추가로 기본 `Namespace`를 지정할 수 있습니다.
    *   **의미**: "어떤 사용자(User)가 어떤 클러스터(Cluster), 어떤 네임스페이스(NameSpace)에 접근할 것인가"를 정의합니다.

### Config 파일 예시 구조

```yaml
apiVersion: v1
kind: Config
preferences: {}

# 1. 클러스터 정보
clusters:
- cluster:
    certificate-authority: /path/to/ca.crt
    server: https://1.2.3.4
  name: development

# 2. 사용자 정보
users:
- name: developer
  user:
    client-certificate: /path/to/client.crt
    client-key: /path/to/client.key

# 3. 컨텍스트 정보 (클러스터 + 유저 + 네임스페이스)
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend

# 현재 사용 중인 컨텍스트
current-context: dev-frontend
```

`context` 부분을 보면 현재 dev-frontend 컨텍스트는 developer 유저 정보를 이용하여 development 로 등록된 클러스터의 frontend namespace 에 접근하는 것을 기본 값으로 합니다.

---

## 2. 단일 Config 파일 사용 (Single Config File)

가장 일반적인 방식으로, 기본 경로(`~/.kube/config`)나 `--kubeconfig` 로 지정한 하나의 설정 파일로 접근 정보를 관리합니다.

### 요약 단계
1.  **Config 파일 작성/수정**: 설정 파일에 필요한 클러스터, 유저, 컨텍스트 정보를 YAML 형식으로 추가합니다.
2.  **Context 전환**: `kubectl config use-context` 명령어로 작업 환경을 전환합니다.

### 파일 구성 예시

기본 `minikube` 설정에 새로운 `hello-world` 컨텍스트를 추가한 형태입니다.

**`~/.kube/config`(별도로 설정하지 않았을 때의 기본 config 파일)**
```yaml
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority: /Users/user/.minikube/ca.crt
    server: https://127.0.0.1:32769
  name: minikube
users:
- name: minikube
  user:
    client-certificate: /Users/user/.minikube/client.crt
    client-key: /Users/user/.minikube/client.key
contexts:
- context:
    cluster: minikube
    user: minikube
  name: minikube
# 추가된 컨텍스트 (같은 클러스터/유저 사용, 다른 네임스페이스)
- context:
    cluster: minikube
    user: minikube
    namespace: hello-world
  name: hello-world
current-context: minikube
```

### 실행 및 확인

```shell
# Context 전환
kubectl config use-context hello-world

# 현재 Context 확인
kubectl config current-context
# 출력: hello-world
```

---

## 3. 여러 Config 파일 사용 (Multiple Config Files)

프로젝트나 환경(Dev, Stage, Prod)별로 설정 파일을 물리적으로 분리하여 관리할 때 유용합니다.

### 요약 단계
1.  **개별 Config 파일 준비**: 목적에 맞는 별도의 YAML 파일들을 작성합니다.
2.  **환경 변수 등록**: `KUBECONFIG` 환경 변수에 파일 경로들을 등록하여 병합합니다.
3.  **통합 사용**: `kubectl`이 병합된 설정을 인식하여 동작합니다.

### 파일 구성 예시

두 개의 파일 `config-demo`와 `config-demo2`가 있다고 가정합니다.

**파일 1: `~/.kube/config-demo` (개발/테스트 환경)**
```yaml
apiVersion: v1
kind: Config
preferences: {}
clusters:
- cluster:
    server: https://1.2.3.4
    certificate-authority: fake-ca-file
  name: development
- cluster:
    server: https://5.6.7.8
    insecure-skip-tls-verify: true
  name: test
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    username: exp
    password: some-password
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
```

**파일 2: `~/.kube/config-demo2` (추가 환경)**
```yaml
apiVersion: v1
kind: Config
preferences: {}
contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

### 환경 변수 설정 및 실행
크게 두 가지 방법에서 선택하여 사용할 수 있습니다.
- 사용할 설정 파일을 플래그로 지정합니다.
- 환경 변수(KUBECONFIG)에 사용할 설정 파일을 추가합니다.

**사용자 설정 파일 플래그로 지정**

사용할 context 를 포함한 파일을 `--kubeconfig` 를 이용하여 지정합니다.

```shell
kubectl config --kubeconfig=~/.kube/config-demo get-contexts
kubectl config --kubeconfig=~/.kube/config-demo2 get-contexts
```

`config-demo` 를 지정하였을 때 해당 파일에 정의된 `developer`, `exp-test` 컨텍스트를 조회할 수 있습니다.
`config-demo2` 를 지정하였을 때 해당 파일에 정의된 `dev-ramp-up` 컨텍스트를 조회할 수 있습니다.


**환경 변수에 추가**

여러 파일을 `kubectl`이 동시에 인식하도록 `KUBECONFIG` 환경 변수를 설정합니다.

```shell
# 환경 변수 설정 (구분자: 리눅스/맥 ':', 윈도우 ';')
export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-demo:${HOME}/.kube/config-demo2"

# 통합된 Context 확인
kubectl config get-contexts
```

`kubectl config get-contexts`를 실행하면, 기본 `config` 파일뿐만 아니라 `config-demo`, `config-demo2`에 정의된 `dev-frontend`, `exp-test`, `dev-ramp-up` 컨텍스트가 모두 리스트에 나타납니다.


### 환경 변수를 사용하는 경우 추가 설정
export 를 이용하여 환경 변수를 추가했을 때 terminal 을 종료하거나 새로운 세션을 열면 환경 변수가 초기화 된다. 이를 방지하기 위해 zsh 이 실행될 때마다 실행하는 .zshrc 파일에 export 명령어를 추가하여 사용한다.

```shell
echo "export KUBECONFIG=${HOME}/.kube/config:${HOME}/.kube/config-demo:${HOME}/.kube/config-demo2" >> ~/.zshrc
```


---

## 참고: K9s 활용

K9s 실행 시 특정 Context를 지정하여 실행할 수 있습니다.

```shell
# dev-frontend 컨텍스트로 K9s 실행
k9s --context dev-frontend
```

---

## 참고자료
- [공식문서](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
- [cheat sheet](https://kubernetes.io/ko/docs/reference/kubectl/cheatsheet/)
