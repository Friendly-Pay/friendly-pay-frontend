import { Outlet } from 'react-router-dom';
import styles from './PageLayout.module.scss';

export function PageLayout() {
    return (
        <div className={styles.root}>
            <div
                id='mainContainer'
                className={styles.content}
            >
                <Outlet />
            </div>
        </div>
    );
}