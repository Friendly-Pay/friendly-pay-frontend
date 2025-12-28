export interface TelegramButtonProps {
    type: 'main' | 'secondary';
    text?: string;
    visible?: boolean;
    disabled?: boolean;
    loading?: boolean;
    hasShineEffect?: boolean;
    /** Только для SecondaryButton */
    position?: 'left' | 'right' | 'top' | 'bottom';
    /** Не скрывать при размонтировании */
    stayOnUnmount?: boolean
    onClick?: () => void;
    fallbackComponent?: React.ComponentType<any>;
}

export interface TelegramMainButtonProps extends Omit<TelegramButtonProps, 'type' | 'position'> {
    // Все поля кроме type и position
}

export interface TelegramSecondaryButtonProps extends Omit<TelegramButtonProps, 'type'> {
    position?: 'left' | 'right' | 'top' | 'bottom';
}