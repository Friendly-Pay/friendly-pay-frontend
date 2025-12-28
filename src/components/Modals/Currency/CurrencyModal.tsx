import { CurrencyButton } from './CurrencyButton';
import { CurrencyRow } from './CurrencyRow';
import { CurrencyType, RubCurrency, TokenCurrency } from '@/states/currency/hooks';
import { Modal, ModalBody, ModalProps, Text } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { useTranslation } from 'react-i18next';
import styles from './CurrencyModal.module.scss';

type CurrencyModalProps = {
    sbp: RubCurrency
    tokens: TokenCurrency[]
    spbAvailable: boolean
    handleCurrencySelect: (currencyId: string, currencyType: CurrencyType) => void
}

export function CurrencyModal({ isOpen, tokens, sbp, spbAvailable, handleCurrencySelect, onClose, onAnimationCompleted }: CurrencyModalProps & ModalProps) {
    const [t] = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            padding={false}
            onClose={onClose}
            onAnimationCompleted={onAnimationCompleted}
        >
            <ModalClose />
            <ModalBody className={styles.body}>
                {spbAvailable && <div className={styles.content}>
                    <Text
                        type='title'
                        align='left'
                        weight='semibold'
                        className={styles.title}
                    >
                        {t('Bank')}
                    </Text>

                    <div className={styles.scrollable}>
                        <div className={styles.horizontalList}>
                            <CurrencyButton
                                name={sbp.shortName}
                                image={sbp.image}
                                description={sbp.description}
                                onClick={() => handleCurrencySelect(sbp.id, sbp.type)}
                            />
                        </div>
                    </div>
                </div>}

                <div className={styles.content}>
                    <Text
                        type='title'
                        align='left'
                        weight='semibold'
                        className={styles.title}
                    >
                        {t('Cryptocurrency')}
                    </Text>

                    <div className={styles.list}>
                        {tokens.map(item => {
                            if (item.type === 'CRYPTO') {
                                return (
                                    <CurrencyRow
                                        key={item.id}
                                        name={item.name}
                                        image={item.image}
                                        network={item.network}
                                        className={styles.item}
                                        onClick={() => handleCurrencySelect(item.id, item.type)}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}