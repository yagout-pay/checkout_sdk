package handlers

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"
    "checkout_sdk/crypto"
    "checkout_sdk/models"
)





func PreparePayment(w http.ResponseWriter, r *http.Request) {
    var (
        merchantID    = os.Getenv("MERCHANT_ID")
        encryptionKey = os.Getenv("ENCRYPTION_KEY")
        postURL       = os.Getenv("POST_URL")
    )

    fmt.Printf("encryption key: %s ", encryptionKey)
    fmt.Printf("merchantId %s \n", merchantID)
    var req models.PaymentRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    // VARIABLES WE NEED FOR THE TXN DETAILS
    agID := "yagout"
    country := "ETH"
    currency := "ETB"
    txnType := "SALE"
    channel := "WEB"
    isLoggedIn := "Y"


    // VARIABLES WE NEED
    pgDetails := "|||"
    cardDetails := "||||"
    upiDetails := ""
    otherDetails := "||||"
    billDetails := "||||"
    shipDetails := "||||||"
    itemDetails := "||"

    custDetails := fmt.Sprintf("%s|%s|%s||%s", req.CustName, req.Email, req.Mobile, isLoggedIn)

    txnDetails := fmt.Sprintf("%s|%s|%s|%s|%s|%s|%s|%s|%s|%s",
        agID, merchantID, req.OrderNo, req.Amount, country, currency, txnType, req.SuccessURL, req.FailureURL, channel)

    allValues := txnDetails + "~" + pgDetails + "~" + cardDetails + "~" + custDetails + "~" + billDetails + "~" + shipDetails + "~" + itemDetails + "~" + upiDetails + "~" + otherDetails


    fmt.Println("[DEBUG] allValues:", allValues)
    fmt.Println("[DEBUG] encryptionKey length:", len(encryptionKey))

    merchantRequest, err := crypto.Encrypt(allValues, encryptionKey)
    if err != nil {
        http.Error(w, "Encryption error", http.StatusInternalServerError)
        return
    }

    hash := crypto.GenerateHash(merchantID, merchantRequest)

    response := map[string]string{
        "me_id":            merchantID,
        "merchant_request": merchantRequest,
        "hash":             hash,
        "post_url":         postURL,
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func HandleSuccess(w http.ResponseWriter, r *http.Request) {
var (
        encryptionKey = os.Getenv("ENCRYPTION_KEY")
    )
    r.ParseForm()
    merchantResponse := r.FormValue("merchant_response")
    decrypted, err := crypto.Decrypt(merchantResponse, encryptionKey)
    if err != nil {
        http.Error(w, "Decryption error", http.StatusInternalServerError)
        return
    }
    fmt.Fprintf(w, "<h1>Payment Successful</h1><p>Details: %s</p>", decrypted)
}


func HandleFailure(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "<h1>Payment Failed</h1>")
}
