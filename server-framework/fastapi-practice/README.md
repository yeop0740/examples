```shell
uv init fastapi-practice
```

```shell
uv add fastapi "uvicorn[standard]"
```

```shell
uv run uvicorn main:app --reload
```

```shell
curl http://127.0.0.1:8000/items/5?q=somequery
```

http://127.0.0.1:8000/docs 에서 swagger ui 확인 가능

```shell
uv lock
```

```shell
uv sync
```

make docker image for deployment
https://fastapi.tiangolo.com/ko/deployment/docker/#_5
https://github.com/astral-sh/uv-docker-example/blob/main/Dockerfile
https://docs.astral.sh/uv/guides/integration/docker/
https://docs.astral.sh/uv/guides/integration/fastapi/
https://www.uvicorn.org/deployment/docker/#docker-compose

```shell
docker build -t hello-world .
```

```shell
docker run -d --name hello-world -p 3000:80 hello-world:latest
```

```shell
curl localhost:3000
```
