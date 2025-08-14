package models

type PaymentRequest struct {
    OrderNo    float64 `json:"order_no"`
    Amount     float64 `json:"amount"`
    CustName   string `json:"cust_name"`
    Email      string `json:"email"`
    FailureURL string `json:"failure_url"`
    Mobile     string `json:"mobile"`
    SuccessURL string `json:"success_url"`
    Channel    string `json:"channel"`
    Country    string `json:"country"`
    Currency   string `json:"currency"`
    TxnType    string `json:"txn_type"`
}
