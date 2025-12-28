import 'swiper/css';
import { AppHooks } from './AppHooks.tsx';
import { AuthErrorFallback } from './components/Error/AuthErrorFallback.tsx';
import AppViews from './views/AppViews.tsx';
import React from 'react';

// @TODO общая ошибка при загрузке данных не только auth error
const AppRender: React.FC = () => {
    return (
        <AuthErrorFallback>
            <AppHooks>
                <AppViews />
            </AppHooks>
        </AuthErrorFallback>
    );
};

export default AppRender;
