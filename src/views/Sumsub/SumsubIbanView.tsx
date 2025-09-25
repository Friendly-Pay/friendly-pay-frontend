import { ScreenLoader } from './components/ScreenLoader';
import { MainLayout } from '@/components/common/MainLayout';
import { safeLanguageCode } from '@/localization/utils';
import { useSumsubStore } from '@/states/iban/sumsub';
import { useUserStore } from '@/states/user/store';
import sumsub, { SnsWebSdk } from '@sumsub/websdk';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import classNames from 'classnames';
import styles from './SumsubIbanView.module.scss';

// @TODO когда нажал кнопку назад - возвращать на главную (не на /sumsub.start)
export function SumsubIbanView() {
    const [t] = useTranslation();
    const isMounted = useRef(false);
    const languageCode = useUserStore(state => state.languageCode);

    const sdkBuilder = useRef<SnsWebSdk | null>(null);
    const sumsubReady = useSumsubStore(state => state.sumsubReady);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // @TODO позже сделать кастомные страницы
    const navigate = useNavigate();
    const redirectingRef = useRef(false);
    const redirectAfterResult = (sumsubStatus?: string) => {
        if (redirectingRef.current) return;
        redirectingRef.current = true;
        navigate(`/sumsub/processing?status=${sumsubStatus}`);
    };

    const triggered = useRef<boolean>(false);
    useEffect(() => {
        if (triggered.current) return;
        triggered.current = true;

        const initSumsub = async () => {
            try {
                const accessToken = await useSumsubStore.getState().generateToken();
                if (!isMounted.current) return;
                if (!sdkBuilder.current) {
                    sdkBuilder.current = sumsub
                        .init(accessToken, () => useSumsubStore.getState().generateToken())
                        .withConf({
                            lang: safeLanguageCode(languageCode),
                            theme: 'light',
                            customizationName: 'Mobile'
                        })
                        .withOptions({
                            addViewportTag: false,
                            adaptIframeHeight: false,
                            enableScrollIntoView: false
                        })
                        .on('idCheck.onReady', () => {
                            if (isMounted.current) useSumsubStore.getState().setReady(true);
                        })
                        .on('idCheck.onError', (error) => {
                            console.error('SumSub error:', error);
                        })
                        .on('idCheck.onApplicantSubmitted', () => {
                            // пользователь нажал Submit → сразу уводим (не показываем их "Pending")
                            if (isMounted.current) redirectAfterResult('submitted');
                        })
                        .on('idCheck.onApplicantStatusChanged', (p: any) => {
                            // результат пришёл мгновенно (GREEN/RED/GRAY/PENDING/COMPLETED) → уводим туда же
                            if (!isMounted.current) return;
                            const status = p?.reviewResult?.reviewAnswer || p?.reviewStatus || 'unknown';
                            redirectAfterResult(status);
                        })
                        .build();
                }
                sdkBuilder.current.launch('#sumsub-container');
            } catch (error) {
                console.error('Sumsub error:', error);
                if (isMounted.current) {
                    toast.error(t('Verification did not start, please try waiting or contact support'));
                }
            }
        };

        initSumsub();

        return () => {
            try {
                useSumsubStore.getState().reset();
                if (sdkBuilder.current) {
                    sdkBuilder.current.destroy();
                }
            } catch (e) {
                console.error('Error destroying SumSub SDK:', e);
            } finally {
                sdkBuilder.current = null;
            }
        };
    }, []);

    return (
        <MainLayout fullHeight>
            <ScreenLoader visible={!sumsubReady} />

            {createPortal(
                <div className={classNames(styles.sumsub, sumsubReady && styles.visible)}>
                    <div
                        id="sumsub-container"
                        className={styles.sdkContainer}
                    />
                </div>,
                document.body
            )}
        </MainLayout>
    );
}