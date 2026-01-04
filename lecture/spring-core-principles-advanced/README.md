# 스프링 핵심 원리 - 심화편

## 프로젝트 생성
- java 17
- spring web
- lombok

### HelloTraceV2 의 한계
- TraceId 를 유지하는 과정이 불편하다.
  - TraceId 를 각각의 레이어에 파라미터로 직접 넘겨 주어야 한다.
    - 각각의 레이어에 의존성을 가진 곳에서 코드 수정이 발생한다.
  - TraceId 가 처음 생성되는 곳과 받아서 사용하는 곳에서 호출하는 메서드가 다르다.
    - 이를 각각의 기능을 하는 객체(로그 추적 기능과 관련 없는 역할을 갖는 객체)가 알고 있어야 한다.
    - 테스트 수행 목적과 벗어나는 TraceId 를 매번 생성하여 넘겨주어야 한다. 

### FieldServiceTest 에서의 동시성 문제

**field_synchronous** 테스트
userA, userB 는 약 1초 동안 수행되고, 내부 필드를 변경하는 작업이다.
- userA 의 작업을 새로운 thread 에서 수행하도록 한다.
- userA 에 대한 작업을 명령하고 main thread 에서 일정 시간(2초) 대기한다.
  - 해당 대기로 인해 userA 작업이 완료 될 때까지 userB 작업이 수행되지 않는다(userA 작업이 성공/실패 에 대해 보장할 수 없다).
- userB 의 작업을 새로운 thread 에서 수행하도록 한다.
- userB 에 대한 작업을 명령하고 main thread 에서 일정 시간(2초) 대기한다.
  - 해당 대기로 인해 main thread 가 종료되지 않고 userB 작업이 완료 될 때까지 대기한다(userB 작업이 성공/실패 에 대해 보장할 수 없다).

main thread 에서의 대기로 인해 userA 와 userB 작업이 순차적으로 실행된다.
따라서 동시성 문제는 발생하지 않는다.
userA 작업의 결과 : nameStore = null -> nameStore = "userA"
userB 작업의 결과 : nameStore = "userA" -> nameStore = "userB"

```shell
18:58:30.856 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.FiledServiceTest -- main start
18:58:30.858 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 저장 name=userA -> nameStore=null
18:58:31.862 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 조회 nameStore=userA
18:58:32.862 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 저장 name=userB -> nameStore=userA
18:58:33.868 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 조회 nameStore=userB
18:58:34.867 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.FiledServiceTest -- main end
```

**field_asynchronous** 테스트
userA, userB 는 약 1초 동안 수행되고, 내부 필드를 변경하는 작업이다.
- userA 의 작업을 새로운 thread 에서 수행하도록 한다.
- userB 의 작업을 새로운 thread 에서 수행하도록 한다.
- userB 에 대한 작업을 명령하고 main thread 에서 일정 시간(2초) 대기한다.
  - 해당 대기로 인해 main thread 가 종료되지 않고 userA, userB 작업이 수행 될 때까지 대기한다(userB 작업이 성공/실패 에 대해 보장할 수 없다).

userA 와 userB 작업의 순서가 보장되지 않는다. 따라서 fieldService.nameStore 에 userA 작업이 종료되지 않은 시점에 userB 작업이 접근/수정할 수 있다.
따라서 동시성 문제는 발생한다.
userA 작업의 결과 : nameStore = null -> nameStore = "userB"
userB 작업의 결과 : nameStore = null -> nameStore = "userB"

userA 가 nameStore 를 변경하기 전 userB 작업이 수행되어 두 작업 모두 nameStore 가 null 인 상태로 인식하였다.
userA, userB 모두 더 늦게 수행된 작업의 결과인 userB 의 nameStore 결과를 확인하게 된다.

```shell
18:22:21.520 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.FiledServiceTest -- main start
18:22:21.522 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 저장 name=userA -> nameStore=null
18:22:21.522 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 저장 name=userB -> nameStore=null
18:22:22.525 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 조회 nameStore=userB
18:22:22.525 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.FieldService -- 조회 nameStore=userB
18:22:24.523 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.FiledServiceTest -- main end
```

### TODO
- [ ] system call 인 print, sleep 에서 context switch 가 발생하는지 확인해보는 것 필요
