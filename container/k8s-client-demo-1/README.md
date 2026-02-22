# k8s java client demo

- 현재 등록된 리소스
- Root CA 등록하는 기능(어드민 페이지에서) -> java cacert 파일에 추가하는 방법 -> 모든 파드에 적용하기 어려움..
  - configmap 혹은 secret 으로 등록해서 강제 rollout 하는 방법 있을 듯...
- /etc/hosts 변경하는 기능 추가 -> deployment 부분에서 조절 가능
 
### 필요한 작업
- [x] 등록하는 도메인에 대한 httproute 생성
- [x] 등록되어 있는 httproute 삭제

- cert file, key file 을 이용하여 tls secret 생성, 수정, 삭제
  - [ ] file 분리
  - [ ] file 로딩(object storage)
  - [ ] tls secret 생성
  - [ ] tls secret 수정
  - [ ] tls secret 삭제
- [ ] tls secret 을 참조하는 gateway 리소스 수정(추가 및 삭제)

- [ ] etc/hosts 에 도메인 추가 명령어
- [ ] 서버 실행되는 deployment에 임의의 a 레코드 추가 api
