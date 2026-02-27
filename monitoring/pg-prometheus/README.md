### 실행 과정

1. docker compose 를 이용하여 컨테이너 실행
2. [grafana](localhost:3000) 의 datasource, dashboard(9628 번 대시보드 임포트) 설정
3. dashboard 의 database 를 `All` -> `postgres`(실제 설정한 db 이름)

![결과](./images/dashboard1.png)
적절한 데이터를 대시보드에서 확인할 수 있다.

### 보완할 점

cadvisor 를 이용하여 container 에 대한 메트릭을 측정하여 관찰하려고 하였으나, 최신 도커 엔진의 설정과 cadvisor 의 호환성이 깨진 부분이 있는 것으로 보인다.
버전을 낮추기도 하고, 설정을 변경해 보았지만, 잘 적용되지 않는 것으로 보아 천천히 적용 해보아야 할 것으로 보인다.
