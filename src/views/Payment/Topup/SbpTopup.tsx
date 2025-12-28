import { usePaymentButtonsVisibility } from '../buttonsContext';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { useBankCard } from '@/states/cards/store';
import { CURRENCY } from '@/states/currency/currency';
import { usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { AmountInput } from '@/uikit/AmountInput/AmountInput';
import { openWebviewLink, showAlert } from '@/utils';
import { formatAmount } from '@/utils/format';
import { convertAmount, fromMinorUnits } from '@/utils/math';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './SbpTopup.module.scss';

enum Field {
    INPUT = 'Input',
    OUTPUT = 'Output'
}

export function SbpTopup() {
    const [t] = useTranslation();
    const locale = useUserStore(state => state.languageCode);
    const cardId = usePaymentStore(state => state.topupSelectedCardId!);
    const bankCard = useBankCard(cardId)!;
    const currencyModalOpened = usePaymentStore(state => state.currencyModal.opened);

    const currencyRate = usePaymentStore(state => state.topupSelectedCurrencyRate!);
    const inverseCurrencyRate = 1 / currencyRate;

    const { buttonsVisible, showButtons } = usePaymentButtonsVisibility();

    useLayoutEffect(() => {
        if (!currencyModalOpened) {
            showButtons();
        }
    }, [currencyModalOpened]);

    const [activeField, setActiveField] = useState<Field>(Field.INPUT);
    const [typedValue, setTypedValue] = useState<{
        value: number | null;
        valueString: string;
    }>();

    const [mainButtonLoading, setMainButtonLoading] = useState(false);

    const inputCurrency = CURRENCY.RUB.mnemonicCode;
    const outputCurrency = bankCard.currency;
    const currencyMinority = 100;

    const valuesMinor = useMemo(() => {
        const typedAmount = typedValue?.value || 0;
        if (!typedAmount) {
            return {
                [Field.INPUT]: undefined,
                [Field.OUTPUT]: undefined
            };
        }
        if (activeField === Field.INPUT) {
            return {
                [Field.INPUT]: typedAmount,
                [Field.OUTPUT]: convertAmount({ amountMinor: typedAmount, rate: currencyRate, targetMinority: currencyMinority, sourceMinority: currencyMinority })
            };
        } else {
            return {
                [Field.INPUT]: convertAmount({ amountMinor: typedAmount, rate: 1 / currencyRate, targetMinority: currencyMinority, sourceMinority: currencyMinority }),
                [Field.OUTPUT]: typedAmount
            };
        }
    }, [typedValue, activeField, currencyRate]);

    const minLimit = useMemo(() => {
        const valueMinor = convertAmount({
            amountMinor: bankCard.minDeposit * currencyMinority,
            rate: inverseCurrencyRate,
            sourceMinority: currencyMinority,
            targetMinority: currencyMinority
        });
        return {
            valueMinor,
            formatted: formatAmount({
                value: valueMinor,
                currency: inputCurrency,
                minority: currencyMinority,
                locale
            }),
        };
    }, [bankCard.minDeposit, inputCurrency, currencyMinority, inverseCurrencyRate, locale]);

    const maxLimitMinority = 100_000 * currencyMinority;
    const maxLimit = useMemo(() => {
        return formatAmount({
            value: maxLimitMinority,
            minority: currencyMinority,
            currency: inputCurrency,
            locale
        });
    }, [inputCurrency, currencyMinority, inverseCurrencyRate, locale]);

    const feeAmount = useMemo(() => {
        const inputAmount = valuesMinor[Field.INPUT];
        if (!inputAmount) {
            return;
        }

        const depositFee = (bankCard.depositFee / 100);
        const value = depositFee * valuesMinor[Field.INPUT];

        return formatAmount({
            value: value,
            minority: currencyMinority,
            currency: inputCurrency,
            locale
        });
    }, [bankCard.depositFee, valuesMinor, inputCurrency, currencyMinority, currencyRate, locale]);

    const handleInputChange = (data: {
        value: number | null;
        valueString: string;
    }) => {
        setActiveField(Field.INPUT);
        setTypedValue(data);
    };

    const handleOutputChange = (data: {
        value: number | null;
        valueString: string;
    }) => {
        setActiveField(Field.OUTPUT);
        setTypedValue(data);
    };

    const getRateDescription = () => {
        if (!typedValue?.value) {
            return (
                <Text
                    type='captionSmall'
                    align='left'
                    weight='regular'
                    className={styles.caption}
                    dangerouslySetInnerHTML={{
                        __html: t('Minimum amount <span>{{minAmount}}</span>', { minAmount: minLimit.formatted.formattedWithCurrency })
                    }}
                />
            );
        }

        const rate = formatAmount({
            value: currencyRate * currencyMinority,
            currency: inputCurrency,
            minority: currencyMinority,
            locale
        });

        const fee = feeAmount ? `${t('Fee')} ${feeAmount.formattedWithCurrency}` : t('No fee');

        return (
            <Text
                type='captionSmall'
                align='left'
                weight='regular'
                className={styles.caption}
                dangerouslySetInnerHTML={{
                    __html: t('At T-Bank rate {{rate}}. {{fee}}', { rate: rate.formattedWithCurrency, fee })
                }}
            />
        );
    };

    const handleCreatePayment = async () => {
        const amountRubMinor = valuesMinor[Field.INPUT];

        if (!amountRubMinor) {
            return showAlert(t('Enter amount'));
        }
        if (amountRubMinor < minLimit.valueMinor) {
            return showAlert(t('Minimum amount\n {{minAmount}}', { minAmount: minLimit.formatted.formattedWithCurrency }));
        }
        if (amountRubMinor > maxLimitMinority) {
            return showAlert(t('Maximum amount\n {{maxAmount}}', { maxAmount: maxLimit.formattedWithCurrency }));
        }

        setMainButtonLoading(true);
        const amountRub = fromMinorUnits(amountRubMinor, currencyMinority);
        const res = await usePaymentStore.getState().createSbpTopup(amountRub);
        const paymentUrl = res?.paymentUrl;
        if (paymentUrl) {
            openWebviewLink(paymentUrl);
        }
        setMainButtonLoading(false);
    };

    const navigate = useNavigate();

    const handleCancelPayment = () => {
        const { topupOrder, resetTopup, cancelTopup } = usePaymentStore.getState();
        navigate(Routes.HOME);
        if (topupOrder) {
            cancelTopup(topupOrder.transactionId);
        }
        resetTopup();
    };

    return (
        <div className={styles.root}>

            <div className={styles.inputs}>
                <AmountInput
                    value={valuesMinor[Field.INPUT]}
                    currency={inputCurrency}
                    fieldClassName={classNames(styles.inputField, styles.inputFieldLeft)}
                    onChange={(_, payload) => handleInputChange(payload)}
                />
                <AmountInput
                    value={valuesMinor[Field.OUTPUT]}
                    currency={outputCurrency}
                    fieldClassName={classNames(styles.inputField, styles.inputFieldRight)}
                    inputClassName={styles.inputNativeRight}
                    onChange={(_, payload) => handleOutputChange(payload)}
                />
            </div>

            {getRateDescription()}

            <TelegramButtons.SecondaryButton
                text={t('Cancel')}
                visible={buttonsVisible}
                onClick={handleCancelPayment}
            />

            <TelegramButtons.MainButton
                text={t('Pay')}
                visible={Boolean(buttonsVisible)}
                loading={mainButtonLoading}
                onClick={handleCreatePayment}
            />
        </div>
    );
}