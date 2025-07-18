import { Search } from '@/components/Icons/Search';
import { ChangeEvent, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './SearchInput.module.scss';

export interface SearchInputProps {
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    tabIndex?: number;
    autoFocus?: boolean;
    keyboardMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            value,
            placeholder,
            onChange,
            tabIndex,
            autoFocus = false,
            keyboardMode = 'text',
            className,
        },
        ref
    ) => {
        const [t] = useTranslation();
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        };

        return (
            <div
                className={classNames(styles.root, className)}
                tabIndex={tabIndex}
            >
                <div className={styles.icon}>
                    <Search />
                </div>

                <input
                    ref={ref}
                    type="text"
                    value={value ?? ''}
                    placeholder={placeholder ?? t('Search')}
                    autoComplete="off"
                    inputMode={keyboardMode}
                    className={styles.input}
                    onChange={handleChange}
                    autoFocus={autoFocus}
                />
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';