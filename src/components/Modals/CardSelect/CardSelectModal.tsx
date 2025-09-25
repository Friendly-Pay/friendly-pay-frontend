import { CardItem } from './CardItem';
import { MyCard } from '@/states/cards/store';
import { Modal, ModalBody, ModalProps } from '@/uikit';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { useMemo } from 'react';
import styles from './CardSelectModal.module.scss';

type CardSelectModalProps = {
    cards: MyCard[]
    onSelectCard: (cardId: number) => void
}

export function CardSelectModal({ isOpen, cards, onSelectCard, onClose, onAnimationCompleted }: CardSelectModalProps & ModalProps) {
    const items = useMemo(() => {
        return cards.map(card => <CardItem
            key={card.id}
            card={card}
            onClick={() => onSelectCard(card.id)}
        />);
    }, [cards]);

    return (
        <Modal
            isOpen={isOpen}
            fullscreen
            onClose={onClose}
            onAnimationCompleted={onAnimationCompleted}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>Куда</ModalTitle>
            <ModalBody className={styles.body}>
                {items}
            </ModalBody>
        </Modal >
    );
}