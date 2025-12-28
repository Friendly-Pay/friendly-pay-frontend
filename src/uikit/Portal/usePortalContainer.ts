import { PortalContext } from './context';
import { getDefaultPortalContainer } from './utils';
import { useContext } from 'react';

export const usePortalContainer = () => {
    const getContextPortalContainer = useContext(PortalContext);

    if (getContextPortalContainer()) {
        return getContextPortalContainer;
    }

    return getDefaultPortalContainer;
};