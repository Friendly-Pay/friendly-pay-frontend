import { StoryContent } from '../../components/Stories/StoryContent';
import { StoryImage } from '../../components/Stories/StoryImage';
import { StoriesSlider } from '@/components/Stories/StoriesSlider';
import { StorySlide } from '@/components/Stories/StorySlide';
import { Routes } from '@/routes';
import { useOnboardingStore } from '@/states/onboarding/store';
import { Button, CircleCloseButton } from '@/uikit';
import story1 from 'assets/onboarding/story_1.png';
import story2 from 'assets/onboarding/story_2.png';
import story3 from 'assets/onboarding/story_3.png';
import story4 from 'assets/onboarding/story_4.png';
import story5 from 'assets/onboarding/story_5.png';
import { motion } from 'framer-motion';
import { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './OnboardingView.module.scss';

const storiesAnim = {
    initial: {
        y: 30,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 200,
            duration: 0.3
        }
    }
};

// @TODO предзагружать сначала картинки и показать loader
export function OnboardingView() {
    const [t] = useTranslation();

    const navigate = useNavigate();

    const handleCompleteOnboarding = useCallback(() => {
        useOnboardingStore.getState().updateOnboardingState(true);
        navigate(Routes.HOME);
    }, [navigate]);

    useLayoutEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        const root = document.getElementById('root');

        const onboardingClassName = 'onboarding-dark';
        const defaulColor = '#FFFFFF';
        const onboardingColor = '#000000';

        html.classList.add(onboardingClassName);
        body.classList.add(onboardingClassName);
        root?.classList.add(onboardingClassName);
        window.Telegram.WebApp.setBackgroundColor(onboardingColor);
        window.Telegram.WebApp.setHeaderColor(onboardingColor);

        return () => {
            html.classList.remove(onboardingClassName);
            body.classList.remove(onboardingClassName);
            root?.classList.remove(onboardingClassName);
            window.Telegram.WebApp.setBackgroundColor(defaulColor);
            window.Telegram.WebApp.setHeaderColor(defaulColor);
        };
    }, []);

    return (
        <motion.div
            {...storiesAnim}
            className={styles.root}
        >
            <div className={styles.closeButton}>
                <CircleCloseButton onClick={handleCompleteOnboarding} />
            </div>

            <StoriesSlider className={styles.slider}>
                <StorySlide>
                    <StoryImage src={story1} />
                    <StoryContent
                        title={t('Friend for your finances in Telegram')}
                        text={t('Pay, transfer and save — manage your money in one app')}
                    />
                </StorySlide>

                <StorySlide>
                    <StoryImage src={story2} />
                    <StoryContent
                        title={t('Open an account in euros in a few minutes')}
                        text={t('Receive SEPA and SWIFT payments. Only for clients across Europe')}
                    />
                </StorySlide>

                <StorySlide>
                    <StoryImage src={story3} />
                    <StoryContent
                        title={t('Issue a card after KYC')}
                        text={t('Verify your identity and pay for the card. Activate it and start using it right away')}
                    />
                </StorySlide>

                <StorySlide>
                    <StoryImage src={story4} />
                    <StoryContent
                        title={t('Pay by touch')}
                        text={t('Simply hold your smartphone near the terminal. One touch is enough to make a purchase. Works everywhere contactless payments are accepted')}
                    />
                </StorySlide>

                <StorySlide>
                    <StoryImage src={story5} />
                    <StoryContent
                        title={t('Transfers to friends or partners')}
                        text={t('Send money worldwide. Fast and with minimal fees')}
                    >
                        <Button
                            size='58'
                            view='primary'
                            className={styles.button}
                            onClick={handleCompleteOnboarding}
                        >
                            {t('Start')}
                        </Button>
                    </StoryContent>
                </StorySlide>
            </StoriesSlider>
        </motion.div>
    );
}