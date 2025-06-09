import { useCardsStore } from '@/states/cards/store';
import { Button, Modal, ModalBody } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { useTranslation } from 'react-i18next';
import styles from './TransactionDetailsModal.module.scss';

export function TransactionDetailsModal() {
    const [t] = useTranslation();
    const isOpen = useCardsStore(state => state.transactionDetailsModal.opened);
    const onClose = useCardsStore(state => state.closeTransactionDetails);
    // const transaction = useCardsStore(state => state.transactionDetailsModal.data);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalTitle>{t('Card details')}</ModalTitle>
            <ModalBody>


                <Button
                    view='secondaryColored'
                    className={styles.button}
                    onClick={onClose}
                >
                    {t('Close')}
                </Button>
            </ModalBody>
        </Modal>
    );
}