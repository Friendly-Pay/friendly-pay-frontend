import { TelegramButton } from './TelegramButton';
import { TelegramSecondaryButtonProps } from './types';
import { memo } from 'react';

export const TelegramSecondaryButton = memo(function TelegramSecondaryButton(props: TelegramSecondaryButtonProps) {
    return <TelegramButton
        type='secondary'
        {...props}
    />;
});