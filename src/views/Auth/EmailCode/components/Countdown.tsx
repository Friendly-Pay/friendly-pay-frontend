import { ConfirmationTexts } from './types';
import { formatMsAsMinutes } from '@/hooks/useCountdown';
import { Button, Spinner, Text } from '@/uikit';
import { type FC, Fragment, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Countdown.module.scss';

type CountdownProps = {
    texts: ConfirmationTexts;
    timeLeft: number;
    codeSentHintVisible: boolean;
    timePassed: boolean;
    processing: boolean;
    handleEmailRetryClick: () => void;
};

export const Countdown: FC<CountdownProps> = ({
    texts,
    timeLeft,
    codeSentHintVisible,
    timePassed,
    processing,
    handleEmailRetryClick,
}) => {
    const renderText = (content: ReactNode) => (
        <Text
            type='caption'
            align='left'
            weight='regular'
            className={classNames(styles.countdownContainer)}
        >
            {content}
        </Text>
    );

    if (codeSentHintVisible) {
        return renderText(texts.codeSended);
    }

    if (processing) {
        return (
            <div className={classNames(styles.loaderWrap, styles.countdownContainer)} >
                <Spinner className={styles.spinner} />
            </div>
        );
    }

    if (timePassed) {
        return (
            <div className={classNames(styles.buttonWrap, styles.countdownContainer)} >
                <Button
                    size='40'
                    view='secondary'
                    onClick={handleEmailRetryClick}
                    className={styles.getCodeButton}
                >
                    {texts.buttonRetry}
                </Button>
            </div>
        );
    }

    return renderText(
        <Fragment>
            {texts.countdown}
            {'\u00A0'}
            <time className={styles.timeCounter}>{formatMsAsMinutes(timeLeft)}</time>
        </Fragment>,
    );
};