import { create } from 'zustand';

interface State {
    rootInitiated: boolean;
}

interface Actions {
    setRootInitiated: (initiated: boolean) => void;
}

export const useLoaderStore = create<State & Actions>((set) => ({
    rootInitiated: false,
    setRootInitiated: (initiated) =>
        set({ rootInitiated: initiated })
}));