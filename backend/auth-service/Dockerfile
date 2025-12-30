# Stage 1: Build stage
# This stage compiles your Java application
FROM maven:3.9.2-eclipse-temurin-17 AS build

# Set working directory inside container
WORKDIR /app

# Copy Maven configuration files first (for better caching)
# Docker caches layers, so if pom.xml doesn't change, dependencies won't re-download
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download all dependencies (this layer will be cached)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
# Creates a .jar file in target/ directory
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
# This stage creates the final lightweight container
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /app

# Copy only the compiled .jar from build stage (not source code)
# This keeps the final image small
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (where Spring Boot runs)
# This is documentation - doesn't actually open the port
EXPOSE 8080

# Command to run when container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
