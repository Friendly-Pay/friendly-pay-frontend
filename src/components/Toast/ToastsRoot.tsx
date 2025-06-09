import { CheckmarkCircle } from '../Icons/Checkmark';
import { Close } from '../Icons/Close';
import { useDeviceStore } from '@/states/device/state';
import { Toaster } from 'sonner';
import styles from './ToastsRoot.module.scss';

const options = {
    duration: 60_000,
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

export const ToastsRoot = () => {
    const safeAreaInset = useDeviceStore(state => state.safeAreaInset);
    const contentSafeAreaInset = useDeviceStore(state => state.contentSafeAreaInset);
    return (
        <Toaster
            position="top-center"
            toastOptions={options}
            icons={{
                success: <CheckmarkCircle />,
                close: <Close />
            }}
            offset={{
                top: `${safeAreaInset.top + contentSafeAreaInset.top}px`,
                right: `${contentSafeAreaInset.right}px`,
                left: `${contentSafeAreaInset.left}px`
            }}
            gap={12}
            expand
            visibleToasts={3}
            closeButton
        />
    );
};