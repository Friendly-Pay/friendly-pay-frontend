import { apiClient } from '@/utils/api';
import axios from 'axios';

/** @returns iso2 */
export const fetchSupportedCountries = async () => {
    const res = await apiClient.get<string[]>('/common/countries/list');
    return res.data;
};

export const fetchUserCountry = async () => {
    try {
        const { data } = await axios.get<{ country?: string }>(
            'https://api.country.is',
            { timeout: 2_000 }
        );
        return data.country;
    } catch (error) {
        console.error('[getUserCountry]', error);
    }
};

// export interface VerificationPayload {
//     phoneNumber: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     birthday: string;
// }

// export interface VerificationResponse {
//     status: number;
// }

// export const completeVerificationLevel1 = async (data: VerificationPayload) => {
//     const res = await apiClient.post<VerificationResponse>('/user/verification', data);
//     return res.data;
// };