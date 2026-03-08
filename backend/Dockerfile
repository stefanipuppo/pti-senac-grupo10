# Stage 1: Build and Extract Layers
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy only the pom first to cache dependency downloads
COPY pom.xml .

# Use BuildKit cache mount to persist the .m2 directory between builds
RUN --mount=type=cache,target=/root/.m2 \
    mvn  -q -e dependency:go-offline -B

COPY src ./src

# Build the application and extract layers for better Docker caching
RUN --mount=type=cache,target=/root/.m2 \
    mvn -q -e package -DskipTests -T 1C && \
    java -Djarmode=layertools -jar target/*.jar extract

# Stage 2: Final Runtime Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy extracted layers from the builder stage
# These layers are ordered from least-frequent to most-frequent changes
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=default

# Use the JarLauncher to start the application using the layers
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
