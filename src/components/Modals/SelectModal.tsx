import { Modal, ModalBody, ModalProps } from '@/uikit';
import { SearchInput } from '@/uikit/Input/SearchInput';
import { ModalClose } from '@/uikit/Modal/Close/ModalClose';
import { ModalTitle } from '@/uikit/Modal/Title/ModalTitle';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import styles from './SelectModal.module.scss';

type SelectModalProps<T> = {
    title: string
    items: T[]
    renderItem: (data: T) => ReactNode
    search: string
    onSearch: (value: string) => void
}

export function SelectModal<T>({ isOpen, title, items, renderItem, search, onSearch, onClose }: SelectModalProps<T> & ModalProps) {
    const [animCompleted, setAnimCompleted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimCompleted(false);
        }
    }, [isOpen]);

    const handleAnimationComplete = () => {
        setAnimCompleted(true);
    };

    const list = useMemo(() => {
        if (!isOpen) return;
        let list = items;
        if (!animCompleted) {
            list = list.slice(0, 20);
        }
        return list.map(renderItem);
    }, [isOpen, items, animCompleted, renderItem]);

    return (
        <Modal
            isOpen={isOpen}
            fullscreen
            onClose={onClose}
            onAnimationCompleted={handleAnimationComplete}
        >
            <ModalClose />
            <ModalTitle className={styles.title}>{title}</ModalTitle>
            <div className={styles.search}>
                <SearchInput
                    value={search}
                    onChange={onSearch}
                />
            </div>
            <ModalBody className={styles.body}>
                {list}
            </ModalBody>
        </Modal >
    );
}