import { ArrowRight } from '@/components/Icons/Arrow';
import { Bank } from '@/components/Icons/Bank';
import { Routes } from '@/routes';
// import { Globe } from '@/components/Icons/Globe';
import { useIbanStore } from '@/states/iban/store';
import { IbanTransferType, useIbanTransferStore } from '@/states/iban/transfer';
import { Modal, ModalBody, Text } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './IbanTransferModal.module.scss';

// @TODO вынести в отдельный компонент такого вида окна
export function IbanTransferModal() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const isOpen = useIbanStore(state => state.transferModalOpened);

    const onStart = (transferType: IbanTransferType) => {
        useIbanTransferStore.getState().setTransferType(transferType);
        navigate(Routes.TRANSFER_FROM_IBAN_ACCOUNT);
    };

    const onClose = () => {
        useIbanStore.getState().closeTransferModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>{t('Where to transfer')}</ModalTitle>
            <ModalBody className={styles.body}>
                <div
                    className={styles.option}
                    onClick={() => onStart(IbanTransferType.SEPA)}
                >
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            <Bank />
                        </div>
                        <Text
                            type='body'
                            align='left'
                            weight='regular'
                        >
                            {t('Within Europe')}
                        </Text>
                    </div>
                    <ArrowRight className={styles.arrow} />
                </div>

                {/* <div
                    className={styles.option}
                    onClick={() => onStart(TransferType.SWIFT)}
                >
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            <Globe />
                        </div>
                        <Text
                            type='body'
                            align='left'
                            weight='regular'
                        >
                            {t('Worldwide')}
                        </Text>
                    </div>
                    <ArrowRight className={styles.arrow} />
                </div> */}

            </ModalBody>
        </Modal>
    );
}