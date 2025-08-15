
# Use Go 1.22 with lightweight Alpine Linux
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Copy go.mod and go.sum first to cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all backend source code
COPY . .

# Build the app starting from cmd/ where main.go is
RUN go build -o main ./cmd

# Use a fresh small Alpine image for production
FROM alpine:latest
WORKDIR /root/

# Copy compiled binary from builder stage
COPY --from=builder /app/main .

# Expose the app port
EXPOSE 8080

# Run the binary
CMD ["./main"]
