import { NavigateFunction, useNavigate } from 'react-router-dom';

export let navigate: NavigateFunction;

export const NavigateBridge = () => {
    navigate = useNavigate();
    return null;
};