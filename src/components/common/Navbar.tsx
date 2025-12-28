import { Home } from '../Icons/Home';
import { Wallet } from '../Icons/Wallet';
import { useTimer } from '@/hooks/useTimer';
import { useDeviceStore } from '@/states/device/state';
import { memo, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Navbar.module.scss';

export const Navbar = memo(function Navbar() {
    const [t] = useTranslation();
    const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const platform = useDeviceStore(state => state.platform);

    let safeBottom = 0;
    if (platform === 'ios') {
        safeBottom = 12;
    } else if (platform === 'android') {
        safeBottom = 6;
    }

    const frameId = useRef(0);

    const [startTimer, clearTimer] = useTimer();

    useEffect(() => {
        return () => {
            clearTimer();
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
                frameId.current = 0;
            }
        };
    }, []);

    const handlePress = (id: string) => {
        const el = iconRefs.current[id];
        if (!el) return;

        if (frameId.current) {
            cancelAnimationFrame(frameId.current);
            frameId.current = 0;
        }

        frameId.current = requestAnimationFrame(() => {
            el.style.transform = 'scale(0.86)';
            clearTimer();
            startTimer(() => {
                el.style.transform = 'scale(1)';
            }, 60);
        });
    };

    const NAV = useMemo(() => [
        { id: 'home', label: t('Home'), icon: <Home /> },
        { id: 'bank/account', label: t('Account'), icon: <Wallet /> },
    ], [t]);

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