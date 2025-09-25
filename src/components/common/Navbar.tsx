import { Home } from '../Icons/Home';
import { Payments } from '../Icons/Payments';
// import { Payments } from '../Icons/Payments';
import { Wallet } from '../Icons/Wallet';
import { useCardsStore } from '@/states/cards/store';
import { useDeviceStore } from '@/states/device/state';
import { memo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Navbar.module.scss';

const NAV = [
    { id: 'home', label: 'Главная', icon: <Home /> },
    { id: 'bank/account', label: 'Счет', icon: <Wallet /> },
    { id: 'bank-transfer', label: 'Платежи', icon: <Payments /> },
] as const;

// @TODO пока нет никакой активной карты скрывать навбар
export const Navbar = memo(function Navbar() {
    const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const platform = useDeviceStore(state => state.platform);
    const myCardsCount = useCardsStore(state => state.myCardsCount);

    let safeBottom = 0;
    if (platform === 'ios') {
        safeBottom = 12;
    } else if (platform === 'android') {
        safeBottom = 6;
    }

    const handlePress = (id: string) => {
        const el = iconRefs.current[id];
        if (!el) return;

        el.style.transition = 'transform 200ms cubic-bezier(.2,0,0,1)';

        requestAnimationFrame(() => {
            el.style.transform = 'scale(0.86)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                setTimeout(() => {
                    if (iconRefs.current[id] === el) {
                        el.style.transition = '';
                    }
                }, 210);
            }, 60);
        });
    };

    if (!myCardsCount) {
        return null;
    }

    return (
        <div className={styles.root}>
            <nav
                id='mobile-navbar'
                className={styles.nav}
                style={{ paddingBottom: safeBottom }}
            >
                {NAV.map(item => {
                    return <NavLink
                        key={item.id}
                        to={`/${item.id === 'home' ? '' : item.id}`}
                        className={({ isActive }) => classNames(styles.link, isActive && styles.active)}
                        tabIndex={0}
                        onMouseDown={() => handlePress(item.id)}
                    >
                        <div className={styles.iconWrap}>
                            <div
                                className={styles.icon}
                                ref={el => iconRefs.current[item.id] = el}
                            >
                                {item.icon}
                            </div>
                        </div>
                        <div className={styles.text}>{item.label}</div>
                    </NavLink>;
                })}
            </nav>
        </div>
    );
});