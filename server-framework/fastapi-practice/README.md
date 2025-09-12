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
