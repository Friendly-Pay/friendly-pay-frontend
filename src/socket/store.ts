import { HubConnectionState } from '@microsoft/signalr';
import { create } from 'zustand';

interface State {
    socketReady: boolean;
    socketState: HubConnectionState;
}

interface Actions {
    setSocketReady: (ready: boolean) => void;
    setSocketState: (state: HubConnectionState) => void;
}

export const useSocketStore = create<State & Actions>((set) => ({
    socketReady: false,
    socketState: HubConnectionState.Disconnected,
    setSocketState: state => set({ socketState: state }),
    setSocketReady: (ready) => set({ socketReady: ready }),
}));