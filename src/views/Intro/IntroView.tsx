import { DepositStory } from './components/DepositStory';
import { DigitalWalletStory } from './components/DigitalWalletStory';
import { PayOnlineStory } from './components/PayOnlineStory';
import { StoriesProgress } from './components/Progress/StoriesProgress';
import { WelcomeStory } from './components/WelcomeStory';
import { MainLayout } from '@/components/common/MainLayout';
import { useDeviceStore } from '@/states/device/state';
import { useUserStore } from '@/states/user/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IntroView.module.scss';

const storyAppearance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export function IntroView() {
    const navigate = useNavigate();
    const platform = useDeviceStore(state => state.platform);

    useLayoutEffect(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        const backgroundColor = rootStyles.getPropertyValue('--color-background').trim();
        const backgroundPrimaryColor = rootStyles.getPropertyValue('--color-background-primary').trim();
        if (platform === 'ios' || platform === 'android') {
            window.Telegram.WebApp.setHeaderColor(backgroundPrimaryColor);
            window.Telegram.WebApp.setBackgroundColor(backgroundPrimaryColor);
            return () => {
                window.Telegram.WebApp.setHeaderColor(backgroundColor);
                window.Telegram.WebApp.setBackgroundColor(backgroundColor);
            };
        } else {
            document.body.style.backgroundColor = backgroundPrimaryColor;
            return () => document.body.style.backgroundColor = '';
        }
    }, []);

    const count = 4;
    const lastIndex = count - 1;
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    const handleNextStory = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        if (currentStoryIndex === lastIndex) {
            useUserStore.getState().setSkipIntro(true);
            navigate('/');
            return;
        }
        setCurrentStoryIndex(currentStoryIndex + 1);
    };

    return (
        <MainLayout className={styles.layout}>
            <StoriesProgress
                count={count}
                currentStoryIndex={currentStoryIndex}
            />

            <div className={styles.content}>
                <AnimatePresence
                    mode='popLayout'
                    initial={false}
                >
                    {currentStoryIndex === 0 && <motion.div
                        key='1'
                        {...storyAppearance}
                        className={styles.story}
                    >
                        <WelcomeStory onClick={handleNextStory} />
                    </motion.div>}

                    {currentStoryIndex === 1 && <motion.div
                        key='2'
                        {...storyAppearance}
                        className={styles.story}
                    >
                        <DepositStory onClick={handleNextStory} />
                    </motion.div>}

                    {currentStoryIndex === 2 && <motion.div
                        key='3'
                        {...storyAppearance}
                        className={styles.story}
                    >
                        <DigitalWalletStory onClick={handleNextStory} />
                    </motion.div>}

                    {currentStoryIndex === 3 && <motion.div
                        key='4'
                        {...storyAppearance}
                        className={styles.story}
                    >
                        <PayOnlineStory onClick={handleNextStory} />
                    </motion.div>}
                </AnimatePresence>
            </div>
        </MainLayout>
    );
}