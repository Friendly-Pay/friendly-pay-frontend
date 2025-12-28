import { apiClient } from '@/utils/api';

interface SumsubLinkResponse {
    verificationLink: string;
}

export const fetchSumsubLink = async (selectedCardTypeId: number | null): Promise<string> => {
    const response = await apiClient.post<SumsubLinkResponse>('/user/sumsub', {
        cardTypeId: selectedCardTypeId
    });

    return response.data.verificationLink;
};