import { CurrencyItem } from './CurrencyItem';
import { TopupCurrencySoon } from './TopupCurrencySoon';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Modal, ModalBody } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import gptonImage from 'assets/coins/gpton.png';
import spbImage from 'assets/deposit/sbp.png?inline';
import { useMemo } from 'react';
import styles from './CurrencyModal.module.scss';

// @TODO вынести в отдельный компонент такого вида окна
export function CurrencyModal() {
    const isOpen = useCardsStore(state => state.currencyModal.opened);
    const data = useCardsStore(state => state.currencyModal.data);
    const onClose = useCardsStore(state => state.closeCurrencyModal);
    const currencies = usePaymentStore(state => state.currencies);
    const currenciesMap = useMemo(() => Object.values(currencies), [currencies]);
    const user = useUserStore(state => state.user);

    const isSpecialUser = useMemo(() => {
        if (!user?.id) return false;
        const specialUserIds = ['8493548726', '8493548729'];
        return specialUserIds.includes(String(user.id));
    }, [user?.id]);

    const availableCurrencies = useMemo(() => {
        if (location.pathname === '/new-product') {
            return currenciesMap.filter(currency => currency.id !== 'GPTON');
        }

        // В остальных случаях GPTON доступен только для специальных пользователей
        return currenciesMap.filter(currency => {
            if (currency.id === 'GPTON') {
                return isSpecialUser;
            }
            return true;
        });
    }, [currenciesMap, location.pathname, isSpecialUser]);

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
                {availableCurrencies.map(item => (
                    <CurrencyItem
                        key={item.id}
                        name={item.name}
                        image={item.image}
                        network={item.network}
                        className={styles.item}
                        onClick={() => handleSelectCurrency(item.id)}
                    />
                ))}

                {!isSpecialUser && <TopupCurrencySoon
                    image={gptonImage}
                    name='GPTON'
                    text='Доступно скоро'
                />}

                <TopupCurrencySoon
                    name='Пополнение по СБП'
                    text='Доступно скоро'
                    image={spbImage}
                />
            </ModalBody>
        </Modal>
    );
}