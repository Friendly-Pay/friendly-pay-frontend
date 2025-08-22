import { ReactNode } from 'react';
import { create } from 'zustand';

export interface DialogOptions {
    title: string;
    text: string;
    icon?: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface DialogState {
    title: string | null;
    text: string | null;
    icon: ReactNode | null;
    isOpen: boolean;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
}

interface DialogActions {
    openDialog: (opts: DialogOptions) => void;
    closeDialog: () => void;
}

export const useDialogStore = create<DialogState & DialogActions>((set, get) => ({
    title: null,
    text: null,
    icon: null,
    isOpen: false,
    onConfirm: null,
    onCancel: null,

    openDialog: ({ title, text, icon = null, onConfirm, onCancel }) => {
        const { closeDialog } = get();
        set({
            title,
            text,
            icon,
            isOpen: true,
            onConfirm: () => { onConfirm?.(); closeDialog(); },
            onCancel: () => { onCancel?.(); closeDialog(); },
        });
    },

    closeDialog: () => {
        set({
            title: null,
            text: null,
            icon: null,
            isOpen: false,
            onConfirm: null,
            onCancel: null,
        });
    },
}));