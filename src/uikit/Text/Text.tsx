import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import styles from './Text.module.scss';

export type TextProps = {
    as?: keyof JSX.IntrinsicElements
    type?:
    | 'headlineExtraLarge'
    | 'headlineLarge'
    | 'headline'
    | 'title'
    | 'bodyLarge'
    | 'body'
    | 'caption'
    | 'captionSmall';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    align?: 'left' | 'center' | 'right';
    noWrap?: boolean;
    uppercase?: boolean;
    style?: CSSProperties;
    className?: string;
    children?: React.ReactNode;
    dangerouslySetInnerHTML?: {
        __html: string | TrustedHTML;
    } | undefined

}
export const Text = React.forwardRef<HTMLElement, TextProps>(
    (
        {
            as: Component = 'div',
            type = 'bodyMedium',
            weight,
            align,
            noWrap,
            uppercase,
            className,
            children,
            dangerouslySetInnerHTML,
            ...props
        },
        ref
    ) => {
        const textClasses = classnames(
            styles.text,
            styles[type],
            weight && styles[weight],
            align && styles[align],
            noWrap && styles.noWrap,
            uppercase && styles.uppercase,
            className
        );

        return React.createElement(
            Component,
            { ref, className: textClasses, dangerouslySetInnerHTML, ...props },
            children
        );
    }
);