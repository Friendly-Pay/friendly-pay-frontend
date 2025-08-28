import { Skeleton } from '../Skeleton/Skeleton';
import { useCardsStore } from '@/states/cards/store';
import { Button, Input, Modal, ModalBody } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { formatCardNumber } from '@/utils';
import { FetchStatus } from '@/utils/api';
import { formatCardExpiration } from '@/utils/date';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CardDetailsModal.module.scss';

export function CardDetailsModal() {
    const [t] = useTranslation();
    const isOpen = useCardsStore(state => state.detailsModal.opened);
    const onClose = useCardsStore(state => state.closeCardDetails);
    const details = useCardsStore(state => state.detailsModal.data);
    const detailsFetchState = useCardsStore(state => state.detailsFetchStatus);

    useEffect(() => {
        if (!isOpen) return;
        if (detailsFetchState === FetchStatus.Idle) {
            useCardsStore.getState().fetchCardDetails();
        }
    }, [isOpen, detailsFetchState]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalTitle>{t('Card details')}</ModalTitle>
            <ModalBody>
                <AnimatePresence mode='popLayout'>
                    {details
                        ? <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.content}
                        >
                            <Input
                                value={formatCardNumber(details.number)}
                                canCopy
                                readOnly
                                copiedToastText={t('Card number copied')}
                                className={styles.input}
                            />

                            <div className={styles.fields}>
                                <Input
                                    value={formatCardExpiration(details.expireAt)}
                                    canCopy
                                    readOnly
                                    copiedToastText={t('Expiration date copied')}
                                    className={styles.input}
                                />
                                <Input
                                    value={details.cvv}
                                    canCopy
                                    readOnly
                                    copiedToastText={t('CVC copied')}
                                    className={styles.input}
                                />
                            </div>
                        </motion.div>
                        : <div className={styles.content}>
                            <Skeleton style={{ height: 52 }} />
                            <div className={styles.fields}>
                                <Skeleton style={{ height: 52 }} />
                                <Skeleton style={{ height: 52 }} />
                            </div>
                        </div>
                    }
                </AnimatePresence>

                <Button
                    view='secondary'
                    className={styles.button}
                    onClick={onClose}
                >
                    {t('Close')}
                </Button>
            </ModalBody>
        </Modal>
    );
}