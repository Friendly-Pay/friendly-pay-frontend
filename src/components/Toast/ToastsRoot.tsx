import { CheckmarkCircle } from '../Icons/Checkmark';
import { Close } from '../Icons/Close';
import { Toaster } from 'sonner';
import styles from './ToastsRoot.module.scss';

const options = {
    duration: 3_000,
    unstyled: true,
    classNames: {
        toast: styles.toast,
        icon: styles.icon,
        title: styles.title,
        content: styles.content,
        error: styles.error,
        success: styles.success,
        closeButton: styles.closeButton,
    },
};

const offset = {
    top: 'calc(var(--safe-area-top) + 16px)',
    right: 'var(--safe-area-left)',
    left: 'var(--safe-area-right)',
};

const mobileOffset = {
    top: 'calc(var(--safe-area-top) + 16px)',
    right: 'var(--safe-area-left)',
    left: 'var(--safe-area-right)',
};

export const ToastsRoot = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={options}
            icons={{
                success: <CheckmarkCircle />,
                close: <Close />
            }}
            offset={offset}
            mobileOffset={mobileOffset}
            gap={12}
            expand
            visibleToasts={3}
            closeButton
        />
    );
};