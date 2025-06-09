import { ClickableBanner } from './ClickableBanner';
import cardBanner from 'assets/card_banner.png?inline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type OrderCardBannerProps = {
    className?: string
}

export function OrderCardBanner({ className }: OrderCardBannerProps) {
    const [t] = useTranslation();
    const navigate = useNavigate();
    return (
        <ClickableBanner
            image={cardBanner}
            title={t('Order new card')}
            text={t('Plastic or virtual')}
            className={className}
            onClick={() => navigate('/new-product')}
        />
    );
}