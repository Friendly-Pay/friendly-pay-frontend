import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import styles from './PageLayout.module.scss';

export function PageLayoutWithNavbar() {
    return (
        <div className={styles.root}>
            <div
                id='mainContent'
                className={styles.content}
            >
                <Outlet />
                <div className={styles.fakeFooter}></div>
            </div>

            <Navbar />
        </div>
    );
}