import { create } from 'zustand';

interface StoriesState {
    activeIndex: number;
}

interface StoriesActions {
    setActiveIndex: (index: number) => void;
    reset: () => void;
}

export const useStoriesStore = create<StoriesState & StoriesActions>((set) => ({
    activeIndex: 0,

    setActiveIndex: (index) => set({ activeIndex: index }),

    reset: () => set({ activeIndex: 0 }),
}));