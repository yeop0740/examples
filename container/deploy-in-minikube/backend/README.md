# Todo List Backend

Todo List 애플리케이션의 백엔드 서버입니다. Node.js, Express, TypeScript로 작성되었습니다.

## 기술 스택

- Node.js
- Express
- TypeScript
- CORS enabled

## 로컬 개발 환경 설정

로컬에서 백엔드만 단독으로 실행하려면 다음 단계를 따르세요.

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 개발 서버 실행:
   ```bash
   npm run dev
   ```
   서버는 `http://localhost:4000`에서 실행됩니다.

## API 명세

데이터는 **메모리(In-Memory)** 에 저장되므로 서버를 재시작하면 초기화됩니다.

| Method | Endpoint     | Description          | Body Example                 |
|--------|--------------|----------------------|------------------------------|
| GET    | `/todos`     | 할 일 목록 조회      | -                            |
| POST   | `/todos`     | 할 일 추가           | `{ "text": "할 일 내용" }` |
| PUT    | `/todos/:id` | 완료 상태 토글       | -                            |
| DELETE | `/todos/:id` | 할 일 삭제           | -                            |
