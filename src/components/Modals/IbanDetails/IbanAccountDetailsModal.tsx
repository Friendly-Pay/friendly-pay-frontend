import { DetailsMessage } from './DetailsMessage';
import { ShareButton } from './ShareButton';
import { ClockFill } from '@/components/Icons/Clock';
import { PropertyRow } from '@/components/Property/PropertyRow';
import { useIbanStore } from '@/states/iban/store';
import { Modal, ModalBody, ModalHead, Tabs } from '@/uikit';
import { copyToClipboard } from '@/utils';
// import { copyToClipboard } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
// import { toast } from 'sonner';
import styles from './IbanAccountDetailsModal.module.scss';

const appearance = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1
    },
    transition: {
        ease: 'easeInOut',
        duration: 0.2
    }
};

export function IbanAccountDetailsModal() {
    const [t] = useTranslation();
    const isOpen = useIbanStore(state => state.ibanAccountDetailsOpened);
    const ibanAccount = useIbanStore(state => state.account!);
    const [activeTab, setActiveTab] = useState('sepa');

    const tabs = [
        { id: 'sepa', label: t('Within Europe') },
        { id: 'swift', label: t('Worldwide') },
    ];

    const handleCopy = async (value: string, toastText: string) => {
        if (!value) return;
        const sanitized = String(value).replace(/\s+/g, '');
        await copyToClipboard(sanitized);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        toast.success(toastText);
    };

    const getShareText = () => {
        if (!ibanAccount) return '';
        const fields = [
            { label: 'Recipient name', value: ibanAccount.recipient },
            { label: 'IBAN', value: ibanAccount.iban },
            { label: 'SWIFT/BIC', value: ibanAccount.swift },
        ];
        if (activeTab === 'swift') {
            fields.push(
                { label: 'Recipient bank', value: ibanAccount.bankName },
                { label: 'Bank address', value: ibanAccount.bankAddress }
            );
        }
        const detailsText = fields
            .filter(field => field.value)
            .map(field => `${field.label}\n${field.value}`)
            .join('\n\n');

        return `Top-up details\n\n${detailsText}`;
    };

    const renderSepaFields = () => {
        return (
            <>
                <PropertyRow
                    label={t('Recipient name')}
                    value={ibanAccount.recipient}
                    onClick={() => handleCopy(ibanAccount.recipient, t('Recipient name copied'))}
                />
                <PropertyRow
                    label={t('IBAN')}
                    value={ibanAccount.iban}
                    onClick={() => handleCopy(ibanAccount.iban, t('IBAN copied'))}
                />
                <PropertyRow
                    label={t('SWIFT/BIC')}
                    value={ibanAccount.swift}
                    onClick={() => handleCopy(ibanAccount.swift, t('SWIFT/BIC copied'))}
                />
            </>
        );
    };

    const renderSwiftFields = () => {
        return (
            <>
                <PropertyRow
                    label={t('Recipient name')}
                    value={ibanAccount.recipient}
                    onClick={() => handleCopy(ibanAccount.recipient, t('Recipient name copied'))}
                />
                <PropertyRow
                    label={t('IBAN')}
                    value={ibanAccount.iban}
                    onClick={() => handleCopy(ibanAccount.iban, t('IBAN copied'))}
                />
                <PropertyRow
                    label={t('SWIFT/BIC')}
                    value={ibanAccount.swift}
                    onClick={() => handleCopy(ibanAccount.swift, t('SWIFT/BIC copied'))}
                />
                <PropertyRow
                    label={t('Recipient bank')}
                    value={ibanAccount.bankName}
                    onClick={() => handleCopy(ibanAccount.bankName, t('Recipient bank copied'))}
                />
                <PropertyRow
                    label={t('Bank address')}
                    value={ibanAccount.bankAddress}
                    onClick={() => handleCopy(ibanAccount.bankAddress, t('Bank address copied'))}
                />
            </>
        );
    };

    const onClose = () => {
        useIbanStore.getState().closeIbanAccountDetails();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            fullscreen
            padding={false}
        >
            <ModalHead>
                {t('Account details')}
            </ModalHead>
            <div className={styles.head}>
                <Tabs
                    items={tabs}
                    activeId={activeTab}
                    onChange={setActiveTab}
                />
            </div>
            <ModalBody className={styles.body}>
                <AnimatePresence mode="wait">
                    {activeTab === 'sepa' ? (
                        <motion.div
                            key="sepa"
                            {...appearance}
                            className={styles.content}
                        >
                            <DetailsMessage
                                icon={<ClockFill />}
                                className={styles.message}
                            >
                                {t('SEPA transfer is usually credited instantly, sometimes within 1–2 business days')}
                            </DetailsMessage>

                            <div className={styles.list}>
                                {renderSepaFields()}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="swift"
                            {...appearance}
                            className={styles.content}
                        >
                            <DetailsMessage
                                icon={<ClockFill />}
                                className={styles.message}
                            >
                                {t('SWIFT transfer is credited within 2–5 business days')}
                            </DetailsMessage>
                            <div className={styles.list}>
                                {renderSwiftFields()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ShareButton
                    shareText={getShareText()}
                    className={styles.button}
                >
                    {t('Share')}
                </ShareButton>
            </ModalBody>
        </Modal>
    );
}