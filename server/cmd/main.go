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

func main() {
    if err := godotenv.Load(); err != nil {
        fmt.Println("No .env file found")
    }

    http.HandleFunc("/", helloWorld)

    http.HandleFunc("/api/prepare-payment", handlers.PreparePayment)
    http.HandleFunc("/success", handlers.HandleSuccess)
    http.HandleFunc("/failure", handlers.HandleFailure)
    fmt.Println("Backend running on :8080")
    http.ListenAndServe(":8080", nil)
}
