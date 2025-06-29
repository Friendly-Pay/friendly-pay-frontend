import { Placeholder } from './Placeholder';
import placeholderTransfer from 'assets/placeholder_transfer.png?inline';

export function TransferPlaceholderView() {
    return (
        <Placeholder
            image={placeholderTransfer}
            title='Международные переводы'
            text='Страница для межднународных переводов'
        />
    );
}