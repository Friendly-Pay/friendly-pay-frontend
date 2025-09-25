import { ArrowRight } from '@/components/Icons/Arrow';
import { TransferRecipientType, useIbanTransferStore } from '@/states/iban/transfer';
import { Modal, ModalBody, Text } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { useTranslation } from 'react-i18next';
import styles from './IbanRecipientModal.module.scss';

// @TODO вынести в отдельный компонент такого вида окна
export function IbanRecipientModal() {
    const [t] = useTranslation();
    const isOpen = useIbanTransferStore(state => state.recipientModalOpened);

    const onSelect = (recipient: TransferRecipientType) => {
        useIbanTransferStore.getState().setTransfer({ recipientType: recipient });
        onClose();
    };

    const onClose = () => {
        useIbanTransferStore.getState().closeRecipientModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>{t('Recipient')}</ModalTitle>
            <ModalBody className={styles.body}>
                <div
                    className={styles.option}
                    onClick={() => onSelect(TransferRecipientType.Private)}
                >
                    <div className={styles.content}>
                        <Text
                            type='body'
                            align='left'
                            weight='regular'
                        >
                            {t('Individual')}
                        </Text>
                    </div>
                    <ArrowRight className={styles.arrow} />
                </div>

                <div
                    className={styles.option}
                    onClick={() => onSelect(TransferRecipientType.Business)}
                >
                    <div className={styles.content}>
                        <Text
                            type='body'
                            align='left'
                            weight='regular'
                        >
                            {t('Business')}
                        </Text>
                    </div>
                    <ArrowRight className={styles.arrow} />
                </div>
            </ModalBody>
        </Modal>
    );
}