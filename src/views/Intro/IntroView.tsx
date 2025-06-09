import { CardStory } from './components/CardStory';
import { StoriesProgress } from './components/Progress/StoriesProgress';
import { WelcomeStory } from './components/WelcomeStory';
import { MainLayout } from '@/components/common/MainLayout';
import { useDeviceStore } from '@/states/device/state';
import { useUserStore } from '@/states/user/store';
import { CloudStorage, isCloudStorageAvailable } from '@/utils/storage';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IntroView.module.scss';

const storyAppearance = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: '0%', opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: {
        duration: 0.3,
        ease: [0, 0.7, 0.2, 1],
        x: {
            type: 'spring',
            damping: 22,
            stiffness: 170,
            restDelta: 0.001,
        },
    }
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

    const count = 2;
    const lastIndex = count - 1;
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    const handleNextStory = () => {
        if (currentStoryIndex === lastIndex) {
            if (isCloudStorageAvailable()) {
                CloudStorage.save('skipIntro', String(true));
            } else {
                localStorage.setItem('skipIntro', String(true));
            }
            useUserStore.getState().setSkipIntro(true);
            navigate('/');
            return;
        }
        setCurrentStoryIndex(currentStoryIndex + 1);
    };

    return (
        <MainLayout>
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
                        <CardStory onClick={handleNextStory} />
                    </motion.div>}
                </AnimatePresence>
            </div>
        </MainLayout>
    );
}