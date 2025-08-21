# Step 1: Build the app with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run the built app
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/moneymanager-1.0.0.jar moneymanager-v1.0.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "moneymanager-v1.0.jar"]

