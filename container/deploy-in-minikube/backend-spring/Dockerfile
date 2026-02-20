FROM amazoncorretto:17 AS builder

COPY . .

RUN ./gradlew build -x test

CMD ["java", "-jar", "/build/libs/backend-spring-0.0.1-SNAPSHOT.jar"]

FROM amazoncorretto:17-alpine3.20 AS runner

COPY --from=builder /build/libs/backend-spring-0.0.1-SNAPSHOT.jar backend-spring.jar

CMD ["java", "-jar", "backend-spring.jar"]
