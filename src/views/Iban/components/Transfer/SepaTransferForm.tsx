import { useIbanStore } from '@/states/iban/store';
import { TransferRecipientType, useIbanTransferStore } from '@/states/iban/transfer';
import { AmountInput, Button, Input, Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './SepaTransferForm.module.scss';

const IBAN_MIN_LENGTH = 15;
const IBAN_MAX_LENGTH = 34;

const AMOUNT_MIN = 1;

// @TODO при выборе получателя чистить форму
// @TODO добавить комиссию при переводе (0,10% мин 1 евро, макс 25 евро)
// @TODO поправить скролл тут
export function SepaTransferForm() {
    const [t] = useTranslation();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const amountInputRef = useRef<HTMLInputElement | null>(null);
    const setTransferData = useIbanTransferStore(state => state.setTransfer);

    const ibanAccount = useIbanStore(state => state.account!);
    const transferRecipientType = useIbanTransferStore(state => state.transfer.recipientType);

    const [recipientName, setRecipientName] = useState('');
    const [recipientError, setRecipientError] = useState<string | undefined>();

    const [iban, setIban] = useState('');
    const [ibanError, setIbanError] = useState<string | undefined>();

    const [details, setDetails] = useState('');
    const [detailsError, setDetailsError] = useState<string | undefined>();

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState<string | undefined>();
    const [amountErrorType, setAmountErrorType] = useState<'empty' | 'min' | 'max' | undefined>();

    const ibanErrorTimeoutRef = useRef<number | null>(null);
    const amountErrorTimeoutRef = useRef<number | null>(null);
    const recipientErrorTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (ibanErrorTimeoutRef.current) clearTimeout(ibanErrorTimeoutRef.current);
            if (amountErrorTimeoutRef.current) clearTimeout(amountErrorTimeoutRef.current);
            if (recipientErrorTimeoutRef.current) clearTimeout(recipientErrorTimeoutRef.current);
        };
    }, []);

    const parseAmount = (v: string) => {
        if (!v) return 0;
        const n = parseFloat(v.replace(/\s/g, '').replace(',', '.'));
        return Number.isFinite(n) ? n : 0;
    };

    const handleRecipientChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        if (newValue.length > 100) return;

        setRecipientName(newValue);
        setRecipientError(undefined);

        if (recipientErrorTimeoutRef.current) clearTimeout(recipientErrorTimeoutRef.current);
        recipientErrorTimeoutRef.current = setTimeout(() => {
            const v = newValue.trim();

            if (!v.length) {
                setRecipientError(t('Enter recipient name'));
                return;
            }
            if (v.length < 2) {
                setRecipientError(t('Recipient name must be at least 2 characters'));
                return;
            }

            // «Два слова» требуем только для частного получателя
            if (transferRecipientType === TransferRecipientType.Private) {
                const words = v.split(/\s+/).filter(Boolean);
                if (words.length < 2) {
                    setRecipientError(t('Enter first and last name'));
                    return;
                }
            }

            setRecipientError(undefined);
        }, 700);
    };

    const handleIbanChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value ?? '';
        let upper = raw.toUpperCase();
        let clean = upper.replace(/[^A-Z0-9]/g, '');
        if (clean.length > IBAN_MAX_LENGTH) clean = clean.slice(0, IBAN_MAX_LENGTH);

        setIban(clean);
        setIbanError(undefined);
        if (ibanErrorTimeoutRef.current) {
            clearTimeout(ibanErrorTimeoutRef.current);
        }

        ibanErrorTimeoutRef.current = setTimeout(() => {
            if (!clean.length) {
                setIbanError(t('Enter IBAN'));
            } else if (clean.length < IBAN_MIN_LENGTH) {
                setIbanError(t('IBAN is too short'));
            } else if (clean.length > IBAN_MAX_LENGTH) {
                setIbanError(t('IBAN is too long'));
            } else {
                setIbanError(undefined);
            }
        }, 700);
    };

    // Обработчик изменения назначения платежа
    const handleDetailsChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        if (newValue.length > 100) return;

        setDetails(newValue);
        setDetailsError(undefined);

        if (!newValue.length) {
            setDetailsError(t('Enter payment details'));
        } else if (newValue.length < 3) {
            setDetailsError(t('Details must be at least 3 characters'));
        } else {
            setDetailsError(undefined);
        }
    };

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
            if (value < AMOUNT_MIN) {
                setAmountError(t('Minimum amount is <span>{{value}} $</span>', { value: AMOUNT_MIN }));
                setAmountErrorType('min');
                return;
            }
            if (value > ibanAccount.balance!) {
                if (ibanAccount.balance! < AMOUNT_MIN) {
                    setAmountError(t('Insufficient balance'));
                    setAmountErrorType('min');
                    return;
                }
                setAmountError(t('Insufficient balance. Available <span>{{value}} $</span>', { value: ibanAccount.balance }));
                setAmountErrorType('max');
                return;
            }
            setAmountError(undefined);
            setAmountErrorType(undefined);
        }, 700);
    };

    // Обработчик клика по ошибке суммы (автозаполнение максимальной суммы)
    const handleClickAmountError = () => {
        if (amountErrorType !== 'max') return;
        if (ibanAccount.balance! <= AMOUNT_MIN) return;
        const maxAmount = String(ibanAccount.balance);
        setTransferData({ amount: maxAmount });
        setAmountError(undefined);
        setAmountErrorType(undefined);
        requestAnimationFrame(() => {
            amountInputRef.current?.focus();
            amountInputRef.current?.setSelectionRange(999, 999);
        });
    };

    const handleEnterKeyDown = (index: number): KeyboardEventHandler<HTMLInputElement> => {
        return (evt) => {
            if (evt.key === 'Enter') {
                evt.preventDefault();
                const nextIndex = index + 1;
                // Если есть следующее поле – перейдём к нему
                if (nextIndex < inputRefs.current.length) {
                    inputRefs.current[nextIndex]?.focus();
                } else {
                    handleSubmit();
                }
            }
        };
    };

    const isSubmitDisabled =
        !recipientName.length ||
        !iban.length ||
        !details.length ||
        !amount.length ||
        !!recipientError ||
        !!ibanError ||
        !!detailsError ||
        !!amountError ||
        parseAmount(amount) < AMOUNT_MIN ||
        parseAmount(amount) > ibanAccount.balance!;


    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (isSubmitDisabled) {
            return;
        }
        setLoading(true);
        try {
            const parsedAmount = parseAmount(amount);
            await useIbanTransferStore.getState().sepaTransfer({
                recipient: recipientName,
                iban: iban.replace(/\s/g, ''),
                details,
                amount: String(parsedAmount),
                recipientType: transferRecipientType
            });
            navigate('/bank/account');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(true);
        }
    };

    let buttonText = t('Transfer');
    if (!isNaN(parseAmount(amount))) {
        buttonText = `${t('Transfer')} ${formatCurrency(amount, 'eur', 'ru', 0)}`;
    }

    let recipientPlaceholder: string;
    if (transferRecipientType === TransferRecipientType.Private) {
        recipientPlaceholder = t('Recipient full name');
    } else {
        recipientPlaceholder = t('Company name');
    }


    return (
        <div className={styles.root}>
            <div className={styles.details}>
                <div className={styles.field}>
                    <Input
                        ref={el => inputRefs.current[0] = el}
                        value={recipientName}
                        onChange={handleRecipientChange}
                        onKeyDown={handleEnterKeyDown(0)}
                        placeholder={recipientPlaceholder}
                        autoComplete="off"
                        enterKeyHint="next"
                        maxLength={100}
                        tabIndex={1}
                    />
                    {recipientError && (
                        <Text
                            type="captionSmall"
                            align="left"
                            className={classNames(styles.caption, styles.error)}
                        >
                            {recipientError}
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <Input
                        ref={el => inputRefs.current[1] = el}
                        value={iban}
                        onChange={handleIbanChange}
                        onKeyDown={handleEnterKeyDown(1)}
                        onBeforeInput={(e: any) => {
                            const ch = e.data as string | null;
                            if (ch && !/^[a-zA-Z0-9 ]$/.test(ch)) e.preventDefault();
                        }}
                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                            const pasted = (e.clipboardData?.getData('text') || '')
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, '');
                            e.preventDefault();
                            handleIbanChange({
                                target: { value: pasted.slice(0, IBAN_MAX_LENGTH) },
                            } as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                        placeholder={t('IBAN')}
                        autoComplete="off"
                        enterKeyHint="next"
                        inputMode="text"
                        maxLength={40}
                        tabIndex={2}
                    />
                    {ibanError && (
                        <Text
                            type="captionSmall"
                            align="left"
                            className={classNames(styles.caption, styles.error)}
                        >
                            {ibanError}
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <Input
                        ref={el => inputRefs.current[2] = el}
                        value={details}
                        onChange={handleDetailsChange}
                        onKeyDown={handleEnterKeyDown(2)}
                        placeholder={t('Payment details')}
                        autoComplete="off"
                        enterKeyHint="next"
                        maxLength={100}
                        tabIndex={3}
                    />
                    {detailsError && (
                        <Text
                            type="captionSmall"
                            align="left"
                            className={classNames(styles.caption, styles.error)}
                        >
                            {detailsError}
                        </Text>
                    )}
                </div>
            </div>

            <div className={styles.main}>
                <div className={styles.field}>
                    <AmountInput
                        ref={amountInputRef}
                        value={amount}
                        suffix='€'
                        onInput={handleAmountInput}
                        onKeyDown={handleEnterKeyDown(3)}
                        placeholder={t('Enter amount')}
                        inputMode="decimal"
                        pattern="[0-9.,]*"
                        enterKeyHint="done"
                        autoComplete="off"
                        minLength={1}
                        maxLength={30}
                        tabIndex={4}
                        wrapperClassName={styles.fieldInput}
                    />
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

                <Button
                    view='primary'
                    loading={loading}
                    disabled={isSubmitDisabled}
                    className={styles.button}
                    onClick={handleSubmit}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}