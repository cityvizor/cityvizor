FROM gradle:6.0.1-jdk11 as gradle

COPY . /home/gradle/server
WORKDIR /home/gradle/server
RUN gradle build

FROM openjdk:11.0.1
WORKDIR /home/server-kotlin
COPY --from=gradle /home/gradle/server/build/distributions /home/server-kotlin/

COPY start_last_local.sh /home/scripts/start_last_local.sh
COPY citylistmetadata_finalresult.json /home/data/citylistmetadata_finalresult.json

CMD ["/bin/bash", "-c", "/home/scripts/start_last_local.sh"]
