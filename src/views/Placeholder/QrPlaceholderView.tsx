import { Placeholder } from './Placeholder';
import placeholderQr from 'assets/placeholder_qr.png?inline';

export function QRPlaceholderView() {
    return (
        <Placeholder
            image={placeholderQr}
            title='Оплата по QR коду'
            text='Страница для оплаты по QR коду'
        />
    );
}