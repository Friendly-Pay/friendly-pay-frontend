export interface SumsubIcons {
    idle: string;
    pending: string;
    success: string;
    needAction: string;
    failed: string;
}

export interface SumsubTexts {
    /**
     * Экран IDLE
     */
    idleTitle: string;
    idleDescription: string;
    idleButton: string;
    idleReadyTitle: string; // Когда, готовы перейти к sumsub
    idleReadyButton: string; // Когда, готовы перейти к sumsub
    cancelButton: string;

    /**
     * Экран PENDING
     */
    pendingTitle: string;
    pendingDescription: string;

    /**
     * Экран NEED_ACTION
     */
    needActionTitle: string;
    needActionDescription: string;
    needActionButton: string;

    /**
     * Экран FAILED
     */
    failedTitle: string;
    failedDescription: string;
    failedButton: string;

    /**
     * Экран SUCCESS
     */
    successTitle: string;
    successDescription: string;
    successButton: string;
}