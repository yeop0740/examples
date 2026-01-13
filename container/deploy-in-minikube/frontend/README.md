# Todo List Frontend

Todo List 애플리케이션의 프론트엔드입니다. Vite, React, TypeScript로 작성되었습니다.

## 기술 스택

- React
- TypeScript
- Vite
- Nginx (Docker 배포 시)

## 로컬 개발 환경 설정

로컬에서 프론트엔드를 실행하려면 백엔드가 실행 중이어야 합니다 (기본 4000 포트).

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 개발 서버 실행:
   ```bash
   npm run dev
   ```
   
> **주의**: 로컬(Vite)에서 실행 시 백엔드 API 호출을 위해 프록시 설정이 필요할 수 있습니다. 현재 코드는 `/api/todos` 경로를 사용하도록 설정되어 있으며, Docker 배포 환경(Nginx)에 최적화되어 있습니다. 로컬 개발 시에는 `vite.config.ts`에 프록시 설정을 추가하거나 백엔드 URL을 직접 수정해야 할 수 있습니다.

## Docker 배포

Docker 빌드 시 멀티 스테이지 빌드를 사용하여 Nginx 이미지로 정적 파일을 서빙합니다.
`nginx.conf` 설정을 통해 `/api/` 경로로 들어오는 요청을 백엔드 컨테이너로 프록시합니다.
