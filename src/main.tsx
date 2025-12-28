import { Loader } from './components/Loader/Loader.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';

const queryClient = new QueryClient();

const AppRender = React.lazy(() => import('./AppRender.tsx'));

const runApp = () => {
    const app = import.meta.env.DEV ? (
        <AppRender />
    ) : (
        <Loader>
            <Suspense fallback={null}>
                <AppRender />
            </Suspense>
        </Loader>
    );

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                {app}
            </QueryClientProvider>
        </React.StrictMode>
    );
};

runApp();

// eslint-disable-next-line no-console
console.log(`🎄 Build: ${import.meta.env.VITE_VERSION}`);