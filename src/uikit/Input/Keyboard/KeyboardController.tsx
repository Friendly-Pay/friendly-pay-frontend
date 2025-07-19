import { HiddenKeyboardInput } from './HiddenKeyboardInput';
import { PropsWithChildren } from 'react';

type KeyboardControllerProps = {
    tabIndex?: number;
    autoFocus?: boolean;
    withKeyboard?: boolean;
    keyboardMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export function KeyboardController({ tabIndex, autoFocus, withKeyboard = false, keyboardMode, children }: PropsWithChildren<KeyboardControllerProps>) {
    return (
        <div tabIndex={tabIndex}>
            {children}
            <HiddenKeyboardInput
                enabled={withKeyboard}
                autoFocus={!autoFocus}
                inputMode={keyboardMode}
            />
        </div>
    );
}