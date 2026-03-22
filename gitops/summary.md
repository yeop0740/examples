GitOps 문서 초안
1. 개요

Kubernetes 환경에서 애플리케이션을 운영하다 보면, 단순히 “배포를 한 번 성공시키는 것”보다 원하는 상태를 지속적으로 유지하는 것이 훨씬 중요해집니다.
초기에는 kubectl apply 나 CI 파이프라인만으로도 운영이 가능해 보이지만, 서비스 수와 클러스터 수, 참여 인원이 늘어날수록 배포 과정은 빠르게 복잡해집니다.

이 문서는 다음 흐름으로 GitOps를 설명합니다.

GitOps의 개념
기존 배포 방식의 문제점
GitOps가 문제를 해결하는 방식
Argo CD, External Secrets Operator를 통한 구체적 구현 방법
2. GitOps란 무엇인가

GitOps는 Git을 단일 진실 공급원(Single Source of Truth) 으로 삼아,
선언형 설정과 자동 동기화를 통해 Kubernetes 클러스터의 상태를 관리하는 운영 방식입니다.

즉, 운영자가 원하는 상태를 Git에 선언해 두고, 실제 클러스터는 그 Git 상태와 지속적으로 일치하도록 유지합니다.

예를 들어 다음과 같은 Kubernetes 매니페스트가 Git에 저장되어 있다고 가정하겠습니다.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
        - name: app
          image: my-app:v1

GitOps에서는 이 YAML이 단순 참고 문서가 아니라,
클러스터가 따라야 할 목표 상태가 됩니다.

3. OpenGitOps의 4대 핵심 원칙

GitOps를 설명할 때는 OpenGitOps 프로젝트에서 제시하는 4가지 원칙을 기준으로 보는 것이 가장 명확합니다.

3.1 선언형 구성

모든 구성은 선언형 파일(YAML 등)로 작성되어 Git에 저장됩니다.
즉, “어떻게 실행할지”보다 “어떤 상태여야 하는지”를 기술합니다.

예를 들어 다음과 같이 Deployment, Service, Ingress, ExternalSecret 등을 모두 선언형으로 관리할 수 있습니다.

apiVersion: v1
kind: Service
metadata:
  name: sample-app
spec:
  selector:
    app: sample-app
  ports:
    - port: 80
      targetPort: 8080

이 방식의 장점은 사람이 직접 상태를 맞추는 대신,
문서화된 상태를 기반으로 시스템이 자동으로 일관성을 유지할 수 있다는 점입니다.

3.2 구성 버저닝

모든 구성은 Git에 저장되고, 모든 변경은 커밋으로 남습니다.
따라서 누가 언제 무엇을 왜 바꿨는지 추적하기 쉽습니다.

예를 들어 다음과 같은 변경 이력을 남길 수 있습니다.

my-app:v1 → my-app:v2 로 이미지 태그 변경
replicas: 2 → replicas: 3 으로 스케일 조정
Ingress 경로 변경
Secret 참조 경로 수정

이력 기반 관리가 가능하기 때문에, 장애 분석과 롤백이 쉬워집니다.

3.3 불변 구성

GitOps에서는 이미 적용된 리소스를 사람이 직접 수정하는 방식보다,
새로운 변경 사항을 Git 커밋으로 반영하는 방식을 지향합니다.

예를 들어 운영 중인 Deployment를 클러스터에 직접 수정하는 대신,

Git의 매니페스트를 수정하고
Pull Request를 리뷰하고
머지 후 자동 동기화를 통해 반영

하는 식으로 운영합니다.

이렇게 해야 “Git에는 A라고 적혀 있는데 실제 클러스터는 B인 상태”를 피할 수 있습니다.

3.4 지속적인 상태 조정

GitOps의 핵심은 단순 배포 자동화가 아니라,
클러스터 상태를 Git에 정의된 상태와 지속적으로 reconcile 하는 것입니다.

예를 들어 누군가 운영 클러스터에서 직접 Deployment의 replica 수를 5로 수정했더라도,
Git에는 replica가 2로 정의되어 있다면 GitOps controller는 이를 감지하고 다시 2로 되돌릴 수 있습니다.

이 원칙은 구성 드리프트(configuration drift) 를 줄이는 데 매우 중요합니다.

4. 기존 Kubernetes 배포 방식의 문제점

GitOps가 필요한 이유를 이해하려면 먼저 기존 방식의 한계를 보는 것이 좋습니다.

일반적인 Kubernetes 배포 흐름은 대개 다음과 같습니다.

애플리케이션 코드 수정
컨테이너 이미지 빌드
이미지 레지스트리에 푸시
Kubernetes 매니페스트 수정
클러스터에 변경 사항 적용

이 과정은 처음에는 단순해 보이지만, 규모가 커질수록 여러 문제가 발생합니다.

4.1 배포 과정이 점점 복잡해진다

애플리케이션 수가 늘어나고, dev/staging/prod 환경이 분리되고,
클러스터가 여러 개로 늘어나면 관리해야 할 매니페스트와 배포 흐름이 급격히 많아집니다.

예를 들어 서비스가 2개일 때는 수작업도 버틸 수 있지만,
서비스가 20개, 환경이 3개가 되면 관리 대상은 금방 수십 배로 늘어납니다.

4.2 수작업 개입으로 인한 휴먼 에러

배포 과정에서 사람이 직접 개입하는 지점이 많을수록 실수가 발생하기 쉽습니다.

예를 들면 아래와 같은 실수가 흔합니다.

잘못된 이미지 태그 적용
잘못된 namespace에 배포
운영 환경에 테스트 설정 반영
Service/Ingress 포트 불일치
이전 버전의 YAML을 실수로 다시 적용

이런 문제는 단발성 실수가 아니라, 운영 규모가 커질수록 반복적으로 나타납니다.

4.3 실제 상태와 의도한 상태가 쉽게 어긋난다

가장 본질적인 문제는 Git, CI, 클러스터 상태가 분리되어 관리된다는 점입니다.

예를 들어 다음과 같은 상황이 생길 수 있습니다.

Git에는 image: my-app:v2 가 기록되어 있음
실제 클러스터는 여전히 v1 이 실행 중임
누군가 운영 클러스터에서 직접 kubectl edit 로 설정을 수정함
해당 변경은 Git에 반영되지 않음

이 상태가 누적되면, 운영자는 “현재 시스템의 진짜 상태”를 Git만 보고 판단할 수 없게 됩니다.

4.4 롤백과 감사가 어렵다

장애가 발생했을 때 빠르게 복구하려면,
무엇이 바뀌었는지 정확히 알아야 하고 이전 상태로 쉽게 돌아갈 수 있어야 합니다.

하지만 기존 방식에서는

변경 이력이 PR이 아니라 사람 기억에 의존하거나
이미지 변경과 매니페스트 변경 이력이 분리되어 있거나
클러스터 직접 수정이 섞여 있거나
누가 어떤 이유로 바꿨는지 기록이 남지 않거나

하는 경우가 많습니다.

4.5 구성 드리프트가 발생한다

구성 드리프트는 의도한 상태와 실제 상태가 점점 달라지는 현상을 의미합니다.

예를 들어 아래와 같은 경우가 드리프트입니다.

Git에는 replicas가 2로 정의되어 있는데 실제 클러스터는 5
Git에는 환경 변수가 없는데 운영 클러스터에는 수동으로 추가됨
Git에는 old image tag가 적혀 있는데 실제는 hotfix 이미지가 떠 있음

드리프트가 심해질수록, 배포와 장애 대응은 점점 더 예측 불가능해집니다.

4.6 보안과 접근 제어가 복잡해진다

기존 방식에서는 배포를 위해 여러 사람이 클러스터에 직접 접근해야 하는 경우가 많습니다.

그 결과,

클러스터 접근 권한이 넓게 퍼지고
운영 변경이 Git이 아닌 직접 조작으로 반영되며
감사 범위가 Git 밖으로 흩어지고
권한 분리와 책임 분리가 어려워집니다

이 문제는 규모가 커질수록 더욱 심각해집니다.

5. GitOps는 이 문제를 어떻게 해결하는가

GitOps는 앞서 언급한 문제들을 한 번에 없애는 마법이 아니라,
운영의 기준점을 Git으로 통일해서 문제를 구조적으로 줄이는 방식입니다.

5.1 선언형 구성으로 수작업을 줄인다

원하는 상태를 YAML로 명시하고 Git에 저장하면,
운영자는 직접 클러스터를 수정하는 대신 선언을 수정하게 됩니다.

예를 들어 replicas를 늘리고 싶다면 운영 클러스터에서 직접 scale 하는 대신,
Git의 YAML에서 replicas: 2 를 replicas: 3 으로 바꾸는 식입니다.

이 방식은 반복 가능하고 리뷰 가능하며 문서화도 자연스럽습니다.

5.2 Git 히스토리로 변경 추적과 롤백을 단순화한다

Git을 중심으로 관리하면 변경 이력, 리뷰, 승인, 롤백이 모두 익숙한 개발 워크플로로 정리됩니다.

예를 들어 장애가 발생했을 때 다음처럼 대응할 수 있습니다.

최근 변경 커밋 확인
문제 커밋 revert
GitOps controller가 이전 상태로 재동기화

즉, 운영 복구가 “운영자의 기억”이 아니라 “버전 관리된 기록”을 기반으로 이루어집니다.

5.3 지속적인 동기화로 드리프트를 줄인다

GitOps 도구는 클러스터 상태를 한 번만 적용하는 것이 아니라,
Git 상태와 실제 클러스터 상태를 계속 비교합니다.

따라서 누군가 직접 클러스터를 수정하거나 일부 리소스가 예기치 않게 바뀌더라도,
GitOps controller가 이를 감지하고 원래 상태로 되돌릴 수 있습니다.

5.4 클러스터 직접 접근을 줄여 보안을 개선한다

GitOps에서는 사람이 직접 클러스터에 접근해 배포하는 대신,
변경을 Git에 반영하고 승인 절차를 거쳐 자동 반영되도록 구성합니다.

이 구조의 장점은 다음과 같습니다.

개발자는 Git에 변경을 제안
리뷰어는 PR을 통해 변경 검토
배포 도구가 클러스터에 반영
클러스터 직접 접근 권한은 최소화

즉, 배포 권한을 Git 기반 승인 흐름으로 전환할 수 있습니다.

6. GitOps 리포지터리 전략

GitOps를 도입할 때는 단순히 도구를 설치하는 것뿐 아니라,
리포지터리를 어떻게 구성할지도 중요합니다.

대표적으로 다음과 같은 전략이 있습니다.

6.1 단일 리포지터리(Mono-repo)

애플리케이션 코드와 Kubernetes 매니페스트를 같은 리포지터리에서 관리하는 방식입니다.

console/
├── src/
└── deploy/

manage-server/
├── src/
└── deploy/
장점
구조가 단순함
초기 도입이 쉬움
개발 코드와 배포 코드 추적이 쉬움
단점
규모가 커지면 복잡해짐
관심사 분리가 어려움
권한 분리(RBAC)가 까다로움
CI에서 매니페스트 수정 커밋이 다시 CI를 유발하는 무한 루프 가능성
적합한 경우
소규모 팀
애플리케이션 수가 적은 경우
빠르게 시작해야 하는 경우
6.2 팀별 리포지터리 분리

애플리케이션 소스 코드는 팀별로 분리하고,
배포 매니페스트는 별도의 GitOps 리포지터리에서 관리하는 방식입니다.

console-app/
└── src/

manage-server-app/
└── src/

gitops-manifests/
├── team-a/console/
└── team-b/manage-server/
장점
관심사 분리가 명확함
역할과 권한 분리가 쉬움
CI 무한 루프 문제를 줄일 수 있음
단점
관리해야 할 리포지터리 수가 늘어남
여러 시스템 변경을 한 번에 보기 어려움
초기 파이프라인 설계가 조금 더 복잡함
적합한 경우
팀 경계가 명확한 조직
운영/개발 권한 분리가 필요한 경우
6.3 애플리케이션별 리포지터리 분리

애플리케이션마다 소스 리포지터리와 배포 리포지터리를 따로 두는 방식입니다.

장점
서비스별 독립성이 높음
서비스별로 세밀한 권한 제어 가능
특정 서비스 장애가 다른 서비스 운영 체계에 덜 영향
단점
리포지터리 수가 급격히 늘어남
공통 변경 반영이 번거로움
전체 가시성 확보가 어려움
적합한 경우
마이크로서비스 수가 많고
각 서비스가 독립된 라이프사이클을 갖는 경우
6.4 환경별 브랜치 전략

같은 리포지터리 안에서 dev, staging, prod 등을 브랜치로 나누는 방식입니다.

장점
기존 Git-flow에 익숙한 조직에는 직관적
환경 간 promote 개념이 명확해 보일 수 있음
단점
장기 브랜치 간 차이가 커짐
merge conflict가 잦아질 수 있음
Kustomize/Helm 기반 템플릿 구조와 잘 맞지 않을 수 있음
실무 관점

최근에는 환경 분리를 브랜치보다 디렉토리 기반으로 하는 경우가 더 일반적입니다.

예:

gitops-manifests/
├── base/
├── overlays/dev/
├── overlays/staging/
└── overlays/prod/
7. GitOps 구현 도구

GitOps 자체는 운영 방식이지만, 실무에서는 이를 지원하는 도구가 필요합니다.
이 문서에서는 특히 Argo CD 와 External Secrets Operator(ESO) 를 중심으로 설명합니다.

Argo CD: Git의 선언된 상태를 클러스터에 지속적으로 반영
ESO: Git에 Secret 원문을 저장하지 않고 외부 Secret 저장소와 연동

둘을 함께 사용하면,
배포 상태와 민감 정보 관리를 분리한 비교적 실용적인 GitOps 구성이 가능합니다.

8. Argo CD
8.1 Argo CD란 무엇인가

Argo CD는 Kubernetes용 GitOps CD 도구입니다.
Git 리포지터리에 저장된 Kubernetes 매니페스트를 기준으로,
실제 클러스터 상태를 지속적으로 동기화합니다.

즉, 사람이 kubectl apply 를 반복하는 대신,
Git 변경이 배포의 출발점이 되도록 만들어 줍니다.

8.2 Argo CD가 해결하는 문제

Argo CD는 다음과 같은 문제를 줄이는 데 도움을 줍니다.

클러스터 직접 적용 의존 감소
Git 상태와 실제 배포 상태 불일치 감소
변경 감지 및 sync 자동화
drift 탐지
UI/CLI 기반 가시성 제공
8.3 Argo CD 동작 예시

흐름은 대체로 아래와 같습니다.

Git 리포지터리에 Kubernetes 매니페스트 저장
Argo CD가 해당 경로를 바라보도록 Application 생성
Argo CD가 Git 상태를 읽음
현재 클러스터 상태와 비교
차이가 있으면 sync 수행
자동 동기화가 켜져 있으면 이후 변경도 지속 반영
8.4 Argo CD 간단 실습
설치
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
CLI 설치
brew install argocd
접근
kubectl port-forward svc/argocd-server -n argocd 8080:443
argocd admin initial-password -n argocd
argocd login 127.0.0.1:8080
애플리케이션 등록
argocd app create nginx \
  --repo https://github.com/helloworld/argocd-tutorial.git \
  --path nginx/alpha \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace app
동기화
argocd app sync nginx
자동 동기화 설정
argocd app set nginx --sync-policy automated

이후 Git에 변경이 반영되면, Argo CD가 이를 감지해 클러스터에 반영할 수 있습니다.

9. External Secrets Operator (ESO)
9.1 ESO란 무엇인가

External Secrets Operator는 Kubernetes Operator로,
외부 Secret 관리 시스템과 Kubernetes Secret 사이를 연결해 주는 도구입니다.

예를 들어 다음과 같은 외부 저장소와 연동할 수 있습니다.

AWS Parameter Store
AWS Secrets Manager
HashiCorp Vault
Google Secret Manager
Azure Key Vault

ESO를 사용하면 Secret 원문을 Git에 직접 저장하지 않고도,
필요한 Secret을 Kubernetes 안으로 동기화할 수 있습니다.

9.2 왜 ESO가 필요한가

GitOps 환경에서 가장 민감한 주제 중 하나는 Secret 관리입니다.

애플리케이션 설정은 Git에 선언형으로 저장하면 좋지만,
비밀번호, 토큰, API 키 같은 민감 정보까지 Git에 그대로 넣는 것은 위험합니다.

ESO는 이 문제를 다음과 같이 해결합니다.

Secret 원문은 외부 저장소에 보관
Git에는 “어떤 Secret을 어디서 가져올지”만 선언
ESO controller가 실제 Kubernetes Secret 생성

즉, GitOps의 선언형 운영과 보안 요구사항을 동시에 만족시키는 데 도움을 줍니다.

9.3 ESO 핵심 리소스
SecretStore / ClusterSecretStore

외부 provider에 어떻게 접근할지 정의합니다.

SecretStore: namespace 범위
ClusterSecretStore: 클러스터 전역 범위

예:

apiVersion: external-secrets.io/v1
kind: SecretStore
metadata:
  name: aws-parameter-store
spec:
  provider:
    aws:
      service: ParameterStore
      region: ap-northeast-2
ExternalSecret

외부 저장소에서 무엇을 가져올지 정의합니다.

예:

apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: fetch-db-password
spec:
  secretStoreRef:
    name: aws-parameter-store
    kind: SecretStore
  target:
    name: db-secret
  data:
    - secretKey: password
      remoteRef:
        key: /my-app/db-password

이 설정이 적용되면, ESO는 외부 저장소의 /my-app/db-password 값을 읽어와
Kubernetes Secret db-secret 의 password 키로 생성합니다.

PushSecret

반대로 Kubernetes 내부 Secret을 외부 저장소로 내보낼 때 사용합니다.

즉, 방향을 정리하면 아래와 같습니다.

ExternalSecret: 외부 → Kubernetes
PushSecret: Kubernetes → 외부
9.4 ESO 동작 예시
단순 문자열 값 가져오기

AWS Parameter Store에 아래 값이 있다고 가정합니다.

/eso-demo/simple-data = test

그러면 다음처럼 가져올 수 있습니다.

apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: simple-secret
spec:
  secretStoreRef:
    name: aws-parameter-store
    kind: SecretStore
  target:
    name: simple-secret
  data:
    - secretKey: value
      remoteRef:
        key: /eso-demo/simple-data

생성된 Kubernetes Secret은 대략 다음 구조를 가집니다.

apiVersion: v1
kind: Secret
metadata:
  name: simple-secret
data:
  value: dGVzdA==

참고로 Kubernetes Secret의 data 값은 암호화가 아니라 Base64 인코딩입니다.

확인은 다음처럼 할 수 있습니다.

kubectl get secret simple-secret -o jsonpath='{.data.value}' | base64 --decode
JSON 형태 값 전체 가져오기

외부 저장소에 아래 JSON이 있다고 가정합니다.

{
  "hello": "world",
  "test": "test"
}

이 경우 dataFrom.extract 를 사용하면 전체 키를 한 번에 가져올 수 있습니다.

apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: structured-secret
spec:
  secretStoreRef:
    name: aws-parameter-store
    kind: SecretStore
  target:
    name: structured-secret
  dataFrom:
    - extract:
        key: /eso-demo/structured-data

그 결과 생성된 Secret은 다음과 비슷한 형태가 됩니다.

data:
  hello: d29ybGQ=
  test: dGVzdA==
JSON의 특정 속성만 가져오기

JSON 전체가 아니라 일부 필드만 사용하고 싶다면 property 를 활용할 수 있습니다.

apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: partial-secret
spec:
  secretStoreRef:
    name: aws-parameter-store
    kind: SecretStore
  target:
    name: partial-secret
  data:
    - secretKey: hello
      remoteRef:
        key: /eso-demo/structured-data
        property: hello

이 방식은 외부 저장소 하나에 여러 값을 JSON으로 넣어두고,
Kubernetes 측에서는 필요한 값만 선택해서 가져오고 싶을 때 유용합니다.

9.5 ESO 간단 실습
ESO 설치
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets \
  -n external-secrets --create-namespace \
  --set installCRDs=true
SecretStore 생성
apiVersion: external-secrets.io/v1
kind: SecretStore
metadata:
  name: aws-parameter-store
spec:
  provider:
    aws:
      service: ParameterStore
      region: ap-northeast-2
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: aws-secret
            key: access-key
          secretAccessKeySecretRef:
            name: aws-secret
            key: secret-access-key
ExternalSecret 생성
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: example
spec:
  refreshInterval: 1h0m0s
  secretStoreRef:
    name: aws-parameter-store
    kind: SecretStore
  target:
    name: secret-to-be-created
    creationPolicy: Owner
  data:
    - secretKey: secret-key-to-be-managed
      remoteRef:
        key: provider-key

적용 후에는 아래처럼 상태를 확인할 수 있습니다.

kubectl apply -f basic-external-secret.yaml
kubectl describe externalsecret example

Ready=True 이고 SecretSynced 메시지가 보이면 정상 동기화된 것입니다.

9.6 보안 및 운영상 고려사항

ESO는 매우 편리하지만, 결국 외부 Secret provider에 접근할 인증 정보가 필요합니다.

즉, “Git에 Secret을 안 넣는다”는 문제는 해결하지만,
“클러스터가 외부 Secret 저장소에 어떻게 안전하게 접근할 것인가”는 별도의 설계가 필요합니다.

실무에서는 보통 다음을 함께 고려합니다.

AWS EKS에서는 IRSA 사용
최소 권한 정책(Least Privilege) 적용
SecretStore / ClusterSecretStore 범위 신중히 설계
필요한 경우 OPA, Kyverno 같은 admission control로 접근 제한
Sealed Secret, Workload Identity 등과 조합 검토
10. Argo CD와 ESO를 함께 사용할 때의 그림

Argo CD와 ESO를 함께 사용하면 역할을 깔끔하게 분리할 수 있습니다.

Argo CD: 배포 상태 동기화
ESO: Secret 관리 분리

예를 들어 Git에는 아래 리소스만 저장할 수 있습니다.

Deployment
Service
Ingress
ExternalSecret
Kustomization / Helm values

그리고 실제 민감 정보는 AWS Parameter Store 같은 외부 저장소에 둡니다.

이 구조의 장점은 다음과 같습니다.

운영 상태는 Git으로 추적 가능
Secret 원문은 Git 밖에서 안전하게 관리 가능
클러스터는 선언된 상태를 자동 반영
변경 승인 흐름을 PR 중심으로 정리 가능
11. 한계와 주의사항

GitOps와 관련 도구는 매우 유용하지만, 다음과 같은 점은 별도로 고민해야 합니다.

11.1 모든 문제를 자동으로 해결해 주지는 않는다

GitOps는 운영 기준을 명확하게 해 주지만,
리포지터리 구조, 권한 모델, 배포 정책, Secret 접근 정책을 대신 설계해 주지는 않습니다.

11.2 Secret 자체의 안전한 보관은 별도 문제다

ESO를 도입해도 provider 접근 정보가 필요합니다.
따라서 IRSA, Workload Identity, Vault 연동 같은 인증 설계가 여전히 중요합니다.

11.3 조직에 맞는 리포지터리 구조가 필요하다

소규모 팀에서는 monorepo가 편할 수 있지만,
규모가 커질수록 배포 전용 리포지터리 분리가 더 적합할 수 있습니다.

11.4 직접 수정 문화를 줄여야 한다

GitOps는 결국 “변경의 출발점이 Git이어야 한다”는 운영 원칙 위에서 잘 작동합니다.
운영자가 계속 클러스터를 직접 수정한다면, GitOps 도구를 붙여도 효과가 반감됩니다.

12. 결론

GitOps의 핵심은 단순 자동 배포가 아닙니다.
더 중요한 것은 Git을 기준으로 선언된 상태와 실제 운영 상태를 지속적으로 일치시키는 운영 방식이라는 점입니다.

기존 Kubernetes 배포 방식은 다음과 같은 한계를 가졌습니다.

수작업 개입이 많음
휴먼 에러 가능성이 큼
변경 추적과 롤백이 어려움
구성 드리프트가 발생함
보안 및 접근 제어가 복잡해짐

GitOps는 이를 다음과 같은 방식으로 해결합니다.

선언형 구성
Git 기반 버전 관리
불변 구성 지향
지속적인 상태 조정

실무에서는 Argo CD를 통해 배포 상태를 동기화하고,
ESO를 통해 Secret을 외부 저장소와 연동하면,
상당히 현실적인 GitOps 운영 체계를 구성할 수 있습니다.

부록: 짧은 요약 버전
GitOps 한 줄 정의

Git을 단일 진실 공급원으로 삼아 Kubernetes의 원하는 상태를 선언형으로 관리하고, 실제 클러스터 상태를 지속적으로 동기화하는 운영 방식

Argo CD 한 줄 정의

Git에 선언된 Kubernetes 리소스를 클러스터와 지속적으로 맞춰주는 GitOps CD 도구

ESO 한 줄 정의

외부 Secret 관리 시스템의 값을 Kubernetes Secret으로 동기화해 주는 Operator

핵심 메시지
Argo CD는 배포 상태를 관리한다
ESO는 민감 정보 관리를 분리한다
둘을 함께 쓰면 GitOps를 실무에 적용하기 쉬워진다
