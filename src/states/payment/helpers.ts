import { PurchaseOrderCrypto, PurchaseOrderSbp, TopupOrderCrypto, TopupOrderSbp } from './store';

type AnyOrder = TopupOrderCrypto | TopupOrderSbp | PurchaseOrderCrypto | PurchaseOrderSbp | null;

export function isCryptoOrder(order: AnyOrder): order is TopupOrderCrypto | PurchaseOrderCrypto {
    return !!order && 'address' in order;
}

export function isSbpOrder(order: AnyOrder): order is TopupOrderSbp | PurchaseOrderSbp {
    return !!order && 'qrLink' in order;
}