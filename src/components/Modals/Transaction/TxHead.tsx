import { ModalHead } from '@/uikit';
import { formatDateWithLabel } from '@/utils/date';

type TxHeadProps = {
    createdAt: number
    className?: string
}

export function TxHead({ createdAt, className }: TxHeadProps) {
    return (
        <ModalHead className={className}>
            {formatDateWithLabel(new Date(Number(createdAt) * 1_000))}
        </ModalHead>
    );
}