import { TelegramButton } from './TelegramButton';
import { TelegramMainButtonProps } from './types';
import { memo } from 'react';

export const TelegramMainButton = memo(function TelegramMainButton(props: TelegramMainButtonProps) {
    return <TelegramButton
        type="main"
        {...props}
    />;
});