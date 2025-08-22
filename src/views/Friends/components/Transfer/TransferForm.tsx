import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { Input, Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './TransferForm.module.scss';

type TransferFormProps = {
    minAmount: number,
    availableAmount: number,
    onTransfer?: () => void
}

export function TransferForm({ minAmount, availableAmount }: TransferFormProps) {
    const [t] = useTranslation();
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState<string | undefined>();
    const [amountErrorType, setAmountErrorType] = useState<'empty' | 'min' | 'max' | undefined>();
    const amountErrorTimeoutRef = useRef<number | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const measureRef = useRef<HTMLSpanElement | null>(null);
    const [suffixLeft, setSuffixLeft] = useState(0);
    const selectOpened = useFriendsBonusesStore(state => state.transferCardSelectOpened);

    const copyTextStylesToMeasure = () => {
        const input = inputRef.current;
        const m = measureRef.current;
        if (!input || !m) return;
        const cs = getComputedStyle(input);
        m.style.font = cs.font;
        m.style.letterSpacing = cs.letterSpacing;
        m.style.textTransform = cs.textTransform as any;
        m.style.lineHeight = cs.lineHeight;
    };

    const updateSuffixPosition = () => {
        const input = inputRef.current;
        const m = measureRef.current;
        if (!input || !m) return;
        m.textContent = amount || '';
        const paddingLeft = parseFloat(getComputedStyle(input).paddingLeft || '0');
        setSuffixLeft(paddingLeft + m.offsetWidth);
    };

    useLayoutEffect(() => {
        copyTextStylesToMeasure();
        updateSuffixPosition();
    }, []);

    useEffect(() => {
        updateSuffixPosition();
    }, [amount]);

    useEffect(() => {
        return () => {
            if (amountErrorTimeoutRef.current) {
                clearTimeout(amountErrorTimeoutRef.current);
            }
        };
    }, []);

    const parseAmount = useCallback((v: string) => {
        if (!v) return 0;
        const n = parseFloat(v.replace(/\s/g, '').replace(',', '.'));
        return Number.isFinite(n) ? n : 0;
    }, []);

    const handleAmountInput = (newValue: string) => {
        setAmount(newValue);
        if (amountErrorTimeoutRef.current) {
            clearTimeout(amountErrorTimeoutRef.current);
        }
        if (!newValue) {
            setAmountError(undefined);
            return;
        }
        amountErrorTimeoutRef.current = setTimeout(() => {
            const value = parseAmount(newValue);
            if (value < minAmount) {
                setAmountError(t('Minimum amount is <span>{{value}} $</span>', { value: minAmount }));
                setAmountErrorType('min');
                return;
            }
            if (value > availableAmount) {
                if (availableAmount < minAmount) {
                    setAmountError(t('Insufficient balance'));
                    setAmountErrorType('min');
                    return;
                }
                setAmountError(t('Insufficient balance. Available <span>{{value}} $</span>', { value: availableAmount }));
                setAmountErrorType('max');
                return;
            }
            setAmountError(undefined);
        }, 700);
    };

    const handleClickAmountError = () => {
        if (amountErrorType !== 'max') return;
        if (availableAmount <= minAmount) return;
        setAmount(String(availableAmount));
        setAmountError(undefined);
        setAmountErrorType(undefined);
        requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(999, 999);
        });
    };

    const isSubmitDisabled =
        !amount.length ||
        !!amountError;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const transferButtonText = !isNaN(parseFloat(amount)) ? `${t('Transfer')} ${formatCurrency(amount, 'usd', 'ru', 0)}` : t('Transfer');

    const handleTransfer = useCallback(async () => {
        if (isSubmitDisabled || loading) return;
        const { transferSelectedCardId, withdraw, setTransferAmount } = useFriendsBonusesStore.getState();
        const parsedAmount = parseAmount(amount);
        try {
            setLoading(true);
            await withdraw({
                cardId: transferSelectedCardId!,
                amount: parsedAmount
            });
            setTransferAmount(parsedAmount);
            navigate('/friends/bonus/transfer/result');
        } catch (error) {
            console.error(error);
            const message = t('An error occurred. Please try again later or contact support');
            window.Telegram.WebApp.showAlert(message);
        } finally {
            setLoading(false);
        }
    }, [amount, loading, isSubmitDisabled, navigate, parseAmount, setLoading]);

    return (
        <>
            <div className={styles.field}>
                <div className={styles.fieldInput}>
                    <Input
                        ref={inputRef}
                        value={amount}
                        onInput={handleAmountInput}
                        className={styles.input}
                        placeholder='Введите сумму пополнения'
                        inputMode='decimal'
                        pattern='[0-9.,]*'
                        enterKeyHint='done'
                        autoComplete='off'
                        onContextMenu={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        minLength={1}
                        maxLength={250}
                        tabIndex={2}
                    />
                    <span
                        ref={measureRef}
                        className={styles.measure}
                        aria-hidden
                    >
                        {amount}
                    </span>
                    {amount && (
                        <span
                            className={styles.currency}
                            style={{ left: `${suffixLeft}px` }}
                        >$</span>
                    )}
                </div>

                {amountError && (
                    <Text
                        type="captionSmall"
                        align="left"
                        className={classNames(styles.caption, styles.error)}
                        dangerouslySetInnerHTML={{ __html: amountError }}
                        onClick={handleClickAmountError}
                    />
                )}
            </div>

            <TelegramMainButton
                text={transferButtonText}
                loading={loading}
                visible={!selectOpened}
                disabled={isSubmitDisabled}
                onClick={handleTransfer}
            />
        </>
    );
}