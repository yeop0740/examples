## Redis Transporter

container 를 통해 redis 를 사용하고 transporter 를 redis 로 변경 한 것, `RedisContext` 를 사용한 것을 제외하고 크게 달라진 부분은 없었습니다.

## TODO

- [ ] docker-compose 환경에서 모두 동일 네트워크 사용 시 port 참조 방식 확인 필요
- [ ] 서비스 간 분리

## 참고
https://github.com/nestjs/nest/tree/master/integration/microservices/src
