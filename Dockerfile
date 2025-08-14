# Stage 1: Build frontend
FROM node:20 AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build backend
FROM golang:1.21 AS backend-builder
WORKDIR /app/server
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ .
# Copy built frontend into backend static folder (adjust path for your Go server)
COPY --from=frontend-builder /app/client/.next /app/server/static/.next
COPY --from=frontend-builder /app/client/public /app/server/static/public
RUN go build -o app .

# Stage 3: Run container
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=backend-builder /app/server/app .
COPY --from=backend-builder /app/server/static ./static
EXPOSE 8080
CMD ["./app"]
