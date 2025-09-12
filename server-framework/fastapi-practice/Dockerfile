# python 공식 이미지 활용
FROM python:3.12-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 워킹 디렉토리를 /code 로 설정한다. 해당 디렉토리에 app 디렉토리와 패키지 정보를 위치시킨다.
WORKDIR /code

# 패키지 파일부터 복사 pyproject.toml 파일이 없으면 uv 가 환경 구성을 못하는 듯
COPY ./uv.lock ./pyproject.toml /code/

# 패키지 설치
RUN uv sync

# 서버 코드 복사
COPY ./app /code/app

# run command
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
