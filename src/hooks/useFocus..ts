import { useCallback, useEffect, useState } from 'react';

type InputMethod = 'keyboard' | 'mouse' | 'touch' | null;

// Глобальная переменная для хранения последнего метода ввода
let prevInputMethod: InputMethod = null;

interface UseFocusOptions {
    /**
     * Тип метода ввода для фильтрации событий фокуса
     */
    inputMethod?: InputMethod;
    /**
     * Элемент для отслеживания (по умолчанию document)
     */
    node?: HTMLElement | null;
}

/**
 * Хук для отслеживания состояния фокуса с фильтрацией по методу ввода
 * @param ref Ref элемента или опции
 * @param inputMethod Метод ввода для фильтрации (опционально)
 */
export function useFocus<T extends HTMLElement>(
    ref: React.RefObject<T> | UseFocusOptions,
    inputMethod?: InputMethod
): [boolean] {
    // Обработка разных сигнатур вызова
    const options: UseFocusOptions =
        typeof ref === 'object' && 'current' in ref
            ? { node: ref.current, inputMethod }
            : ref;

    const { inputMethod: method, node } = options;

    const [focus, setFocus] = useState(false);

    const handleFocus = useCallback(() => {
        if (!method || method === prevInputMethod) {
            setFocus(true);
        }
    }, [method]);

    const handleBlur = useCallback(() => {
        setFocus(false);
    }, []);

    // Эффект для подписки на события фокуса
    useEffect(() => {
        const targetNode = node || document;

        targetNode.addEventListener('focusin', handleFocus);
        targetNode.addEventListener('focusout', handleBlur);

        return () => {
            targetNode.removeEventListener('focusin', handleFocus);
            targetNode.removeEventListener('focusout', handleBlur);
        };
    }, [handleFocus, handleBlur, node]);

    // Эффект для глобальных слушателей метода ввода
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Игнорируем специальные клавиши, которые не меняют метод ввода
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            prevInputMethod = 'keyboard';
        };

        const handleMouseDown = () => {
            prevInputMethod = 'mouse';
        };

        const handleTouchStart = () => {
            prevInputMethod = 'touch';
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('touchstart', handleTouchStart);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('touchstart', handleTouchStart);
        };
    }, []);

    return [focus];
}