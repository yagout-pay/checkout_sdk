package main

import (
	"checkout_sdk/handlers"
	"fmt"
	"net/http"

	"github.com/joho/godotenv"
)

func helloWorld(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "Hello World")
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "https://d22e169bb385.ngrok-free.app")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	fs := http.FileServer(http.Dir("./static"))
    http.Handle("/", fs)

	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}
	mux := http.NewServeMux()

	mux.HandleFunc("/", helloWorld)
	mux.HandleFunc("/api/prepare-payment", handlers.PreparePayment)
	// mux.HandleFunc("/success", handlers.HandleSuccess)
	// mux.HandleFunc("/failure", handlers.HandleFailure)

    fmt.Println("Backend running on http://localhost:3000")
	http.ListenAndServe(":3000", corsMiddleware(mux))
}
