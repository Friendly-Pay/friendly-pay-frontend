import { ArrowRight } from '@/components/Icons/Arrow';
import { languages } from '@/localization';
import { Modal, ModalBody, ModalProps, Text } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './LanguageModal.module.scss';

type LanguageModalProps = {
    onChange: (locale: string) => void
}

export function LanguageModal({ isOpen, onChange, onClose, onAnimationCompleted }: LanguageModalProps & ModalProps) {
    const [t] = useTranslation();
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onAnimationCompleted={onAnimationCompleted}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>{t('Select language')}</ModalTitle>
            <ModalBody>
                <div className={styles.list}>
                    {languages.map(language => <div
                        key={language.locale}
                        className={classNames(styles.item)}
                        onClick={() => onChange(language.locale)}
                    >
                        <div className={styles.content}>
                            <div className={styles.emoji}>{language.emoji}</div>
                            <Text
                                type='body'
                                align='left'
                                weight='regular'
                                className={styles.name}
                            >
                                {language.name}
                            </Text>
                        </div>

                        <div className={styles.icon}>
                            <ArrowRight />
                        </div>
                    </div>)}
                </div>
            </ModalBody>
        </Modal>
    );
}