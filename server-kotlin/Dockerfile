FROM gradle:6.1.1-jdk11 as gradle

COPY . /home/gradle/server
WORKDIR /home/gradle/server
RUN gradle build -x test

FROM openjdk:alpine
WORKDIR /home/server-kotlin
COPY --from=gradle /home/gradle/server/build/libs/server-0.0.5.jar /home/server-kotlin/

CMD ["java", "-jar", "-Xmx128m", "/home/server-kotlin/server-0.0.5.jar"]
