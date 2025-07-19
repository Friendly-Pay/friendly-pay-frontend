import { StageRoot } from './Common/StageRoot';
import { Spinner, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './PreloadingStage.module.scss';

export function PreloadingStage() {
    const [t] = useTranslation();

    return (
        <StageRoot initial={false}>
            <Text
                type='headline'
                align='left'
                weight='semibold'
                className={styles.title}
            >{t('Loading data, one moment... 😁')}</Text>

            <Spinner className={styles.spinner} />
        </StageRoot>
    );
}