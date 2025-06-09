import { createContext, createRef, RefObject } from 'react';

export type ModalState = {
    isOpen: boolean,
    close?: () => void,
    bodyRef: RefObject<HTMLDivElement>
}

export const ModalContext = createContext<ModalState>({
    isOpen: false,
    close: undefined,
    bodyRef: createRef()
});