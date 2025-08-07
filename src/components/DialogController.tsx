import { useDialogStore } from '@/states/dialog';
import { Dialog } from '@/uikit';
import { memo } from 'react';

export const DialogController = memo(function DialogController() {
    const isOpen = useDialogStore(state => state.isOpen);
    const title = useDialogStore(state => state.title);
    const text = useDialogStore(state => state.text);
    const icon = useDialogStore(state => state.icon);
    const onConfirm = useDialogStore(state => state.onConfirm);
    const onCancel = useDialogStore(state => state.onCancel);

    return (
        <Dialog
            isOpen={isOpen}
            title={title}
            text={text}
            icon={icon}
            onConfirm={onConfirm || undefined}
            onCancel={onCancel || undefined}
            onClose={onCancel || undefined}
        />
    );
});