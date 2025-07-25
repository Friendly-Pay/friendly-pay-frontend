import { AppHooks } from './AppHooks.tsx';
import { AuthErrorFallback } from './components/Error/AuthErrorFallback.tsx';
import { useAuthStore } from './states/auth/store.ts';
import { useUserStore } from './states/user/store.ts';
// import { loadEruda } from './utils/index.ts';
import { AppViews } from './views/AppViews.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.scss';

const queryClient = new QueryClient();
// if (import.meta.env.VITE_DEV_LOAD_ERUDA || import.meta.env.VITE_API_BASE_URL === 'https://test2.friendlypay.app') {
//     loadEruda();
// }
// 
// loadEruda();

// @TODO общая ошибка при загрузке данных не только auth error
export function App() {
    const user = useUserStore(state => state.user);
    const authData = useAuthStore(state => state.authData);
    return (
        <QueryClientProvider client={queryClient}>
            {/* <button
                style={{
                    position: 'absolute',
                    left: '0',
                    top: 'var(--safe-area-top)',
                    right: '0',
                    zIndex: 99999,
                }}
                onClick={() => { const a = useUserStore.getState().blurBalance; useUserStore.getState().setBlurBalance(!a); }}
            >test</button> */}
            {user && user.id === '376181959' && <div
                style={{
                    position: 'absolute',
                    left: '0',
                    top: 'var(--safe-area-top)',
                    right: '0',
                    wordBreak: 'break-all',
                    zIndex: 99999,
                    color: '#ffffff',
                    backgroundColor: 'rgba(0,0,0,0.70)',
                    pointerEvents: 'all',

                    // вот новые свойства:
                    WebkitUserSelect: 'text',    // для WebKit‑браузеров
                    MozUserSelect: 'text',       // для Firefox
                    msUserSelect: 'text',        // для IE/Edge Legacy
                    userSelect: 'text',          // стандарт
                    WebkitTouchCallout: 'default' // чтобы появлялось меню Copy/Paste на iOS
                }}
            >
                {authData}
            </div>}
            <AuthErrorFallback>
                <AppHooks>
                    <AppViews />
                </AppHooks>
            </AuthErrorFallback>
        </QueryClientProvider>
    );
}

export default App;
