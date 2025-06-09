import { Text } from '@/uikit';
import { Button } from '@/uikit/Button';
import { Modal, ModalBody, ModalProps } from '@/uikit/Modal';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { useTranslation } from 'react-i18next';
import styles from './WalletModal.module.scss';

type WalletModalProps = {
    title: string,
    platform: 'ios' | 'android'
}

export function WalletModal({ title, platform, isOpen, onClose }: WalletModalProps & ModalProps) {
    const [t] = useTranslation();
    const instructions =
        platform === 'ios'
            ? t('Open Apple Wallet. Tap \"+\". Follow the instructions to add your card."')
            : t('Open Google Pay. Tap \"Add card\". Follow the on-screen instructions.');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalClose />
            <ModalBody>
                <div className={styles.head}>
                    <Text
                        type='headline'
                        align='left'
                        weight='semibold'
                    >
                        {title}
                    </Text>
                </div>

                <div className={styles.content}>
                    <Text
                        type='body'
                        align='left'
                        weight='regular'
                        className={styles.text}
                    >
                        {instructions}
                    </Text>

                    <Button
                        view='secondary'
                        onClick={onClose}
                    >
                        Закрыть
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
}