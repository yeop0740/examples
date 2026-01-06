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

### Thread Local
해당 스레드만 접근할 수 있는 특별한 저장소를 의미한다
각 스레드 마다 별도의 내부 저장소를  제공한다. 같은 인스턴스의 스레드 로컬 필드에 접근해도 동시성 문제가 발생하지 않는다.
스레드 로컬은 동시에 여러 요청이 들어오더라도 각각의 스레드에 해당하는 값을 관리해준다.

### 주의사항
thread local 의 사용이 끝난 후 remove 를 해주어야 한다.
thread 는 재사용된다. 따라서 thread local 의 데이터를 remove 하지 않으면 남아있게 된다.
동일한 thread 를 사용하는 요청에서 남아있는 데이터를 이용하여 어떤 작업을 수행하게 될 수 있다.

### ThreadLocalServiceTest 에서의 동시성 문제

**field_synchronous** 테스트
- FieldServiceTest 와 동일한 과정이다. 다만 Thread Local 을 사용하여 변수를 관리한다.

main thread 에서의 대기로 인해 userA 와 userB 작업이 순차적으로 실행된다.
thread local 에서 userA, userB 에 대한 각각의 값을 관리해준다(userA 의 작업과 userB 의 작업에서 실제 참조하는 변수가 다르다). 따라서 동시성 문제가 발생하지 않는다.
userA 작업의 결과 : nameStore = null -> nameStore = "userA"
userB 작업의 결과 : nameStore = null -> nameStore = "userB"

```shell
20:32:40.544 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.ThreadLocalServiceTest -- main start
20:32:40.545 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 저장 name=userA -> nameStore=null
20:32:41.550 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 조회 nameStore=userA
20:32:42.550 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 저장 name=userB -> nameStore=null
20:32:43.556 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 조회 nameStore=userB
20:32:44.554 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.ThreadLocalServiceTest -- main end
```

**field_asynchronous** 테스트
- FieldServiceTest 와 동일한 과정이다. 다만 Thread Local 을 사용하여 변수를 관리한다.

userA 와 userB 작업의 순서가 보장되지 않는다.
thread local 에서 userA, userB 에 대한 각각의 값을 관리해준다(userA 의 작업과 userB 의 작업에서 실제 참조하는 변수가 다르다). 따라서 동시성 문제가 발생하지 않는다.
userA 작업의 결과 : nameStore = null -> nameStore = "userB"
userB 작업의 결과 : nameStore = null -> nameStore = "userB"

```shell
20:28:30.473 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.ThreadLocalServiceTest -- main start
20:28:30.474 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 저장 name=userB -> nameStore=null
20:28:30.474 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 저장 name=userA -> nameStore=null
20:28:31.480 [tread-A] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 조회 nameStore=userA
20:28:31.480 [tread-B] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService -- 조회 nameStore=userB
20:28:33.480 [Test worker] INFO org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.ThreadLocalServiceTest -- main end
```

### 템플릿 메서드 패턴
부모 클래스에 반복되는 패턴인 템플릿을 정의하고, 일부 변경되는 로직은 자식 클래스에서 정의하여 사용할 수 있도록 하는 방식.
자식 클래스에서 특정 부분만 재정의 할 수 있다(상속, 오버라이딩을 이용).

상속을 사용함으로 발생하는 단점.
- 자식 클래스가 부모 클래스와 컴파일 시점에 강결합 되는 문제(의존 관계를 갖는다)
  - 자식 클래스 입장에선 부모 클래스의 기능을 전혀 사용하지 않는다. 하지만, 템플릿 메서드 패턴을 위해 자식 클래스는 부모 클래스를 상속 받는다.
  - 자식 클래스가 부모 클래스의 기능을 사용하지 않음에도 부모 클래스를 알아야 한다.
  - 부모 클래스를 수정하면 자식 클래스에 영향을 줄 수 있다.

### 전략 패턴
변하지 않는 부분을 `Context` 에 두고, 변하는 부분을 `Strategy` 인터페이스로 정의하여 인터페이스를 구현하도록 하는 패턴이다.
context 는 템플릿 역할을 하고 strategy 는 변하는 로직 역할을 한다.
context 와 strategy 를 실행 전 원하는 모양으로 조립한뒤, context 를 실행하는 형태의 로직에서 유용하다.

context 와 strategy 를 조립한 이후에는 전략을 변경하기 번거롭다.
context 에서 strategy 를 변경하는 로직을 구성할 수 있다. 하지만, 동시성 이슈 등의 고려할 점이 생긴다.

**전략을 파라미터로 전달받는 방식**
컨텍스트의 실행 시점에 전략을 넘겨주는 방식이다.
- 실행 시점에 전략을 변경할 수 있다(동시성 문제 등을 고려하지 않아도 된다).
- 실행할 때마다 전략을 지정해주어야 한다(객체를 생성하는 오버헤드 발생).

**전략 패턴의 의도**
알고리즘 제품군을 정의하고 각각을 캡슐화 하여 알고리즘 간 자유롭게 교환할 수 있도록 구성한다.
전략을 사용하면 알고리즘을 사용하는 클라이언트와 독립적으로 알고리즘을 변경할 수 있다.

전략을 필드로 갖고 교환할 수 있도록 구현하는 것과 전략을 사용하는 시점에 파라미터로 받아 교환할 수 있도록 구현하는 것 모두 알고리즘 간 자유롭게 교환할 수 있도록 하기 위함이므로
구현 방식의 차이로 생각해야한다(동일한 의도).

### 템플릿 콜백 패턴
인수로써 넘겨주는 실행 가능한 코드를 콜백이라고 한다.
파라미터로 전략을 전달받도록 구현한 전략 패턴 같은 형태를 템플릿 콜백 패턴이라고 한다.
GOF 패턴은 아니고, 스프링 내부에서 자주 사용되는 방식이다.
`~Template` 클래스에서 사용되는 패턴으로 보면 된다. 해당 클래스들의 내부 구현을 확인하면 유사한 형태로 이루어 졌음을 알 수 있다.

익명 클래스, 람다(구현해야 하는 메서드가 하나일 경우만) 를 사용하는 경우가 있다. 만약 해당하는 코드가 재사용이 된다면, 별도의 클래스로 정의한다.

### TODO
- [ ] system call 인 print, sleep 에서 context switch 가 발생하는지 확인해보는 것 필요
- [ ] request scope 의 LogTrace 를 생성하여 각각의 요청 마다 알맞은 객체를 생성하도록 구성하는 방법 고려 - 물론 요청 마다 객체를 생성하므로 오버헤드가 Local Thread 를 이용하는 것 보다는 클 것임
