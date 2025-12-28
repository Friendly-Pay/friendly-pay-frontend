import { ArbiLogoLoader } from '@/components/Icons/ArbiLogo';
import { useLoaderStore } from '@/states/loader';
import { Spinner } from '@/uikit';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './Loader.module.scss';

export function Loader({ children }: PropsWithChildren) {
    const visible = useLoaderStore(state => state.isGlobalPreloaderVisible);

    return (<>
        {visible && <div className={classNames(styles.loader)}>
            <div className={styles.logo}>
                <ArbiLogoLoader />
            </div>
            <div className={styles.spinner}>
                <Spinner />
            </div>
        </div>}

        {children}
    </>);
}