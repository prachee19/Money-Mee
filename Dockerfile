FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the correct jar
COPY target/moneymanager-1.0.0.jar moneymanager-v1.0.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "moneymanager-v1.0.jar"]
