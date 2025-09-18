import { CalculatorForm } from '../components/Calculator/CalculatorForm';
import { ExitButton } from '../components/ExitButton';
import { PageRoot } from '../components/PageRoot';
import { MainLayout } from '@/components/common/MainLayout';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './CalculatorView.module.scss';

export function CalculatorView() {
    const [t] = useTranslation();
    return (
        <MainLayout>
            <PageRoot>
                <div className={styles.content}>
                    <ExitButton />
                    <Text
                        type='headline'
                        align='left'
                        weight='semibold'
                        className={styles.title}
                    >
                        {t('Transfer amount')}
                    </Text>

                    <CalculatorForm />
                </div>
            </PageRoot>
        </MainLayout>
    );
}