import { CurrencyItem } from './CurrencyItem';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { Modal, ModalBody } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { useMemo } from 'react';
import styles from './CurrencyModal.module.scss';

// @TODO вынести в отдельный компонент такого вида окна
export function CurrencyModal() {
    const isOpen = useCardsStore(state => state.currencyModal.opened);
    const data = useCardsStore(state => state.currencyModal.data);
    const onClose = useCardsStore(state => state.closeCurrencyModal);
    const currencies = usePaymentStore(state => state.currencies);
    const currenciesMap = useMemo(() => Object.values(currencies), [currencies]);

    const handleSelectCurrency = (currencyId: string) => {
        data?.onSelectCurrency(currencyId);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>{data?.title}</ModalTitle>
            <ModalBody className={styles.body}>
                {currenciesMap.map(item => (
                    <CurrencyItem
                        key={item.id}
                        name={item.name}
                        image={item.image}
                        network={item.network}
                        className={styles.item}
                        onClick={() => handleSelectCurrency(item.id)}
                    />
                ))}
            </ModalBody>
        </Modal>
    );
}