# Stage 1: build
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# copy maven files first for caching
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B dependency:go-offline

# copy source and build
COPY src ./src
RUN mvn -B package -DskipTests

# Stage 2: runtime
FROM eclipse-temurin:17-jre
WORKDIR /app

# copy jar (adjust name if different)
COPY --from=build /app/target/*.jar app.jar

# expose port used by Spring Boot
EXPOSE 8080

# run
ENTRYPOINT ["java","-jar","/app/app.jar"]
