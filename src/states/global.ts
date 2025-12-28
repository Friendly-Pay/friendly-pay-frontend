import { apiClient } from '@/utils/api';
import { create } from 'zustand';

interface ProjectInfoResponse {
    supportSbp: boolean;
}

interface GlobalState {
    supportSbp: boolean;
    loadGlobalSettings: () => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set) => ({
    supportSbp: false,

    loadGlobalSettings: async () => {
        const res = await apiClient.get<ProjectInfoResponse>('/projects');
        set({ supportSbp: res.data.supportSbp });
    },
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getGlobalStore = () => useGlobalStore.getState();
}