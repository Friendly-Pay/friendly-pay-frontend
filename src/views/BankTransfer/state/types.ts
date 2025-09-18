export enum BankTransferMethod {
    /** Local transfer */
    BankTransfer = 'BankTransfer',
    /** SWIFT */
    GlobalBankTransfer = 'GlobalBankTransfer'
}

export interface BankTransferCurrency {
    currency: string;
    method: BankTransferMethod;
    country: string;
    feeRate: number; // (с добавочным нашим процентом)
    feeMin: number;  // (с добавочным нашим процентом)
    minAmount: number;
    maxAmount: number;
    exchangeRate: number; // (между USD и отправляемой валютой)
}

export enum BankTransferTransactionStatus {
    Expired = 'Expired',
    WaitingPayment = 'WaitingPayment',
    InProgress = 'InProgress',
    Success = 'Success',
    Failed = 'Failed'
}

export enum BankTransferTransactionComplianceStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Success = 'Success',
    Failed = 'Failed'
}

export interface BankTransferTransaction {
    id: number;
    method: BankTransferMethod;
    sourceAmount: number;
    sourceCurrency: string;
    payoutAmount: number;
    payoutCurrency: string;
    walletAddress: string;
    status: BankTransferTransactionStatus;
    complienceStatus: BankTransferTransactionComplianceStatus | null;
    createdAt: number;
}