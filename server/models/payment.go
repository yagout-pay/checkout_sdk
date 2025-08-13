package models

type PaymentRequest struct {
    OrderNo      string `json:"order_no"`
    Amount       string `json:"amount"`
    CustName     string `json:"cust_name"`
    Email        string `json:"email"`
    Mobile       string `json:"mobile"`
    SuccessURL   string `json:"success_url"`
    FailureURL   string `json:"failure_url"`
}
