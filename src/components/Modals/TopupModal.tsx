import { TopupCurrency } from './TopupCurrency';
import { TopupCurrencySoon } from './TopupCurrencySoon';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { Modal, ModalBody } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import spbImage from 'assets/deposit/sbp.png?inline';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './TopupModal.module.scss';


export function TopupModal() {
    const [t] = useTranslation();
    const isOpen = useCardsStore(state => state.topupModal.opened);
    const onClose = useCardsStore(state => state.closeTopupModal);
    const cardId = useCardsStore(state => state.selectedCardId);
    const currencies = usePaymentStore(state => state.currencies);
    const currenciesMap = useMemo(() => Object.values(currencies), [currencies]);

    const navigate = useNavigate();
    const handleSelectCurrency = (currencyId: string) => {
        if (!cardId) return;
        usePaymentStore.getState().startTopup(cardId, currencyId);
        navigate('/payments/topup');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>{t('Choose currency')}</ModalTitle>
            <ModalBody className={styles.body}>
                {currenciesMap.map(item => (
                    <TopupCurrency
                        key={item.id}
                        name={item.name}
                        image={item.image}
                        network={item.network}
                        approximateSeconds={item.approximateSeconds}
                        className={styles.item}
                        onClick={() => handleSelectCurrency(item.id)}
                    />
                ))}

                <TopupCurrencySoon
                    name='Пополнение по СБП'
                    text='Доступно скоро'
                    image={spbImage}
                />
            </ModalBody>
        </Modal>
    );
}