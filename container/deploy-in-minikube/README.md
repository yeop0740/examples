# Todo List 서비스

React 프론트엔드와 Express 백엔드로 구성된 간단한 Todo List 웹 애플리케이션입니다. Docker Compose를 사용하여 두 서비스를 오케스트레이션합니다.

## 프로젝트 구조

- **frontend**: React (Vite, TypeScript) 애플리케이션. Nginx를 통해 서빙되며 백엔드로 API 요청을 프록시합니다.
- **backend**: Node.js (Express, TypeScript) 애플리케이션. 인메모리 데이터를 사용하여 Todo 항목을 관리합니다.

## 실행 방법 (Docker 사용)

Docker와 Docker Compose가 설치되어 있어야 합니다.

1. 컨테이너 빌드 및 실행:
   ```bash
   docker-compose up --build
   ```

2. 웹 브라우저 접속:
   - [http://localhost:3000](http://localhost:3000)

## 실행 방법 (Minikube Kubernetes 사용)

Minikube가 실행 중이어야 합니다 (`minikube start`).

1. Minikube Docker 환경으로 전환 (이미지를 Minikube 내부에 빌드하기 위함):
   ```bash
   eval $(minikube docker-env)
   ```

2. 이미지 빌드:
   ```bash
   docker-compose build
   ```

3. Kubernetes 리소스 배포:
   ```bash
   kubectl apply -f k8s-manifest.yaml
   ```

4. 서비스 접속:
   프론트엔드 서비스 접근을 위해 터널링을 사용하거나 URL을 확인합니다.
   ```bash
   minikube service frontend
   ```
   또는
   ```bash
   minikube tunnel
   ```
   실행 후 localhost:80 접속.

## 서비스 정보

- **Frontend**: 3000 포트
- **Backend**: 4000 포트 (외부 노출됨, 프론트엔드는 내부 네트워크 또는 프록시를 통해 통신)

## API 엔드포인트

- `GET /todos`: 목록 조회
- `POST /todos`: 항목 추가
- `PUT /todos/:id`: 항목 수정 (완료 상태 토글)
- `DELETE /todos/:id`: 항목 삭제

```shell
minikube image load deploy-in-minikube-backend:latest
minikube image load deploy-in-minikube-frontend:latest
```

```shell
kubectl apply -f k8s-manifest.yaml
```

https://github.com/kubernetes/examples/blob/master/web/guestbook/all-in-one/frontend.yaml
