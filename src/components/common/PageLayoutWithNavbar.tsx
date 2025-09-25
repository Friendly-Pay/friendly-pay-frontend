import { Navbar } from './Navbar';
import { useUserStore } from '@/states/user/store';
import { Outlet } from 'react-router-dom';
import styles from './PageLayout.module.scss';

export function PageLayoutWithNavbar() {
    const userId = useUserStore(state => state.user!.id);
    const hasAccess = ['7870291431', '434418227', '376181959', '699777633', '419750601'].includes(userId);
    return (
        <div className={styles.root}>
            <div
                id='mainContent'
                className={styles.content}
            >
                <Outlet />
                <div className={styles.fakeFooter}></div>
            </div>

            {/* @TODO remove */}
            {(hasAccess || import.meta.env.DEV) && <Navbar />}
        </div>
    );
}