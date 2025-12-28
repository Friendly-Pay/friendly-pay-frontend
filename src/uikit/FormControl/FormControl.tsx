import React, { type HTMLAttributes, type ReactNode } from 'react';
import cn from 'classnames';
import styles from './FormControl.module.scss';

export type StyleColors = {
    default: {
        [key: string]: string;
    };
    inverted: {
        [key: string]: string;
    };
};

export type FormControlProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Заблокированное состояние
     */
    disabled?: boolean;

    /**
     * Cостояние только для чтения
     */
    readOnly?: boolean;

    /**
     * Заполненное состояние
     */
    filled?: boolean;

    /**
     * Выбранное (фокус) состояние
     */
    focused?: boolean;

    /**
     * Отображение ошибки
     */
    error?: ReactNode | boolean;

    /**
     * Текст подсказки
     */
    hint?: ReactNode;

    /**
     * Лейбл компонента
     */
    label?: ReactNode;

    /**
     * Вид лейбла внутри / снаружи
     */
    labelView?: 'inner' | 'outer';

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: ReactNode;

    /**
     * Слот под полем
     */
    bottomAddons?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для поля
     */
    fieldClassName?: string;

    /**
     * Дополнительный класс для поля
     */
    inputWrapperClassName?: string;

    /**
     * Дополнительный класс для лейбла
     */
    labelClassName?: string;

    /**
     * Дополнительный класс для аддонов
     */
    addonsClassName?: string;

    /**
     * Свойства для обертки левых аддонов
     */
    leftAddonsProps?: HTMLAttributes<HTMLDivElement>;

    /**
     * Свойства для обертки правых аддонов
     */
    rightAddonsProps?: HTMLAttributes<HTMLDivElement>;

    /**
     * Компонент поля (инпут, textarea и пр.)
     */
    children?: ReactNode;
};

/** @ https://www.npmjs.com/package/@alfalab/core-components-form-control */
export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
    (
        {
            block = false,
            className,
            fieldClassName,
            inputWrapperClassName,
            labelClassName,
            addonsClassName,
            disabled,
            readOnly,
            focused,
            filled,
            error,
            hint,
            label,
            labelView = 'inner',
            leftAddons,
            rightAddons,
            bottomAddons,
            children,
            leftAddonsProps,
            rightAddonsProps,
            ...restProps
        },
        ref,
    ) => {
        const errorMessage = typeof error === 'boolean' ? '' : error;

        return (
            <div
                className={cn(
                    styles.component,
                    className,
                    {
                        [styles.block]: block,
                        [styles.hasLeftAddons]: leftAddons,
                        [styles.hasRightAddons]: rightAddons || error,
                    },
                )}
            >
                {label && labelView === 'outer' && (
                    <span
                        className={cn(
                            styles.above,
                            styles.above,
                            styles.label,
                        )}
                    >
                        {label}
                    </span>
                )}
                <div
                    {...restProps}
                    className={cn(
                        fieldClassName,
                        styles.inner,
                        {
                            [styles.disabled]: disabled || readOnly,

                            [styles.filled]: filled,
                            [styles.hasInnerLabel]: label && labelView === 'inner',

                            [styles.focused]: focused,

                            [styles.hasError]: error,
                        },
                    )}
                    ref={ref}
                >
                    {leftAddons && (
                        <div
                            {...leftAddonsProps}
                            className={cn(
                                styles.addons,
                                styles.leftAddons,
                                addonsClassName,
                                leftAddonsProps?.className,
                            )}
                        >
                            {leftAddons}
                        </div>
                    )}

                    <div className={cn(styles.inputWrapper, inputWrapperClassName)}>
                        {label && labelView === 'inner' && (
                            <React.Fragment>
                                <span
                                    className={styles.hiddenLabel}
                                    aria-hidden={true}
                                >
                                    {label}
                                </span>
                                <div
                                    className={cn(
                                        styles.label,
                                        labelClassName,
                                    )}
                                >
                                    <span className={styles.labelInner}>
                                        {label}
                                    </span>
                                </div>
                            </React.Fragment>
                        )}
                        {/* TODO править класс size */}
                        <div className={cn(styles.input)}>
                            {children}
                        </div>
                    </div>

                    {rightAddons && (
                        <div
                            {...rightAddonsProps}
                            className={cn(
                                styles.addons,
                                styles.rightAddons,
                                addonsClassName,
                                rightAddonsProps?.className,
                            )}
                        >
                            {rightAddons}
                        </div>
                    )}
                </div>
                {bottomAddons}

                {errorMessage && (
                    <span
                        className={cn(
                            styles.sub,
                            styles.error,
                        )}
                        role='alert'
                    >
                        {errorMessage}
                    </span>
                )}

                {hint && !errorMessage && (
                    <span
                        className={cn(
                            styles.sub,
                            styles.hint,
                        )}
                    >
                        {hint}
                    </span>
                )}
            </div>
        );
    },
);