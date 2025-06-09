export interface PurchaseCompleted {
    transactionId: number
}

export interface DepositProcessing {
    transactionId: number,
    amount: number,
    currency: string
}