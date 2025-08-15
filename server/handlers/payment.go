package handlers

import (
	"checkout_sdk/crypto"
	"checkout_sdk/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func PreparePayment(w http.ResponseWriter, r *http.Request) {
	merchantID := os.Getenv("MERCHANT_ID")
	encryptionKey := os.Getenv("ENCRYPTION_KEY")
	postURL := os.Getenv("POST_URL")

	if merchantID == "" || encryptionKey == "" || postURL == "" {
		http.Error(w, "server configuration error", http.StatusInternalServerError)
		return
	}

	var req models.PaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request format", http.StatusBadRequest)
		return
	}

	amount := req.Amount

	txnString := fmt.Sprintf(
    "yagout|%s|%.0f|%.2f|ETH|ETB|SALE|%s|%s|WEB~|||~|||~%s|%s|%s|0|Y~||||~||||||~||~~||||",
    merchantID,
    req.OrderNo,
    amount,
    req.SuccessURL,
    req.FailureURL,
    req.CustName,
    req.Email,
    req.Mobile,
)
    fmt.Println(txnString);

	hashInput := fmt.Sprintf(
    "%s~%.0f~%.2f~ETH~ETB",
    merchantID,
    req.OrderNo,
    amount,
	)

	fmt.Printf("Transaction String: %s\n", hashInput)

	hash, err := crypto.GenerateHash(hashInput, encryptionKey)

	if err != nil {
		http.Error(w, fmt.Sprintf("hash generation failed: %v", err), http.StatusInternalServerError)
		return
	}

	encryptedRequest, err := crypto.Encrypt(txnString, encryptionKey)
	if err != nil {
		http.Error(w, fmt.Sprintf("encryption failed: %v", err), http.StatusInternalServerError)
		return
	}


	response := map[string]string{
		"me_id":            merchantID,
		"merchant_request": encryptedRequest,
		"hash":             hash,
		"post_url":         postURL,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}




func HandleCallback(w http.ResponseWriter, r *http.Request) {
	fmt.Println("ethiopia is the best country in the world")
	encryptionKey := os.Getenv("ENCRYPTION_KEY")
	if encryptionKey == "" {
		http.Error(w, "server configuration error", http.StatusInternalServerError)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(w, "invalid form data", http.StatusBadRequest)
		return
	}

	receivedEncryptedHash := r.FormValue("hash")
	encryptedResponse := r.FormValue("merchant_response")

	if encryptedResponse != "" {
		// 1. Decrypt the merchant_response
		decryptedRequest, err := crypto.Decrypt(encryptedResponse, encryptionKey)
		if err != nil {
			fmt.Printf("[ERROR] Decryption of merchant_response failed: %v\n", err)
			http.Error(w, "failed to process payment response", http.StatusInternalServerError)
			return
		}
		fmt.Printf("[INFO] Decrypted merchant_request: %s\n", decryptedRequest)

		// 2. Decrypt the received hash
		if receivedEncryptedHash != "" {
			decryptedHash, err := crypto.Decrypt(receivedEncryptedHash, encryptionKey)
			if err != nil {
				fmt.Printf("[ERROR] Decryption of hash failed: %v\n", err)
			} else {
				// 3. Generate expected hash from the decrypted merchant_request
				expectedHash, err := crypto.GenerateHash(decryptedRequest, encryptionKey)
				if err != nil {
					fmt.Printf("[ERROR] Failed to generate expected hash: %v\n", err)
				} else if decryptedHash != expectedHash {
					fmt.Printf("[WARNING] Hash mismatch\nExpected: %s\nGot: %s\n", expectedHash, decryptedHash)
				} else {
					fmt.Println("[INFO] Hash validation succeeded")
				}
			}
		}
	}

	// Redirect based on callback URL
	if r.URL.Path == "/success" {
		http.Redirect(w, r, "/payment-success", http.StatusSeeOther)
	} else {
		http.Redirect(w, r, "/payment-failed", http.StatusSeeOther)
	}
}
