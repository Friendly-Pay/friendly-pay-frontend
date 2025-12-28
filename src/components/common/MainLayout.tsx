import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './MainLayout.module.scss';

type MainLayoutProps = {
    fullSpace?: boolean
    fullHeight?: boolean
    className?: string
    onAnimationCompleted?: () => void
}

const appearance = {
    initial: {
        y: 1,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1
    },
    transition: {
        y: {
            ease: 'easeInOut',
            duration: 0.08
        },
        opacity: {
            duration: 0.15
        }
    }
};

// @TODO нужно анимации обновить на уровне роутера
export function MainLayout({ fullSpace, fullHeight, className, onAnimationCompleted, children }: PropsWithChildren<MainLayoutProps>) {
    return (
        <motion.div
            {...appearance}
            onAnimationComplete={onAnimationCompleted}
            className={classNames(styles.layout, fullHeight && styles.fullHeight, fullSpace && styles.fullSpace, className)}
        >
            {children}
        </motion.div>
    );
}

// Код, чтобы был прям переход между роутами

// const AnimatedRoutes: React.FC<PropsWithChildren> = ({ children }) => {
//     const location = useLocation();
//     return (
//         <AnimatePresence mode="wait" initial={false}>
//             <Routes location={location} key={location.pathname}>
//                 {children}
//             </Routes>
//         </AnimatePresence>
//     );
// };

// const animation = {
//     initial: {
//         y: 2,
//         opacity: 0,
//     },
//     animate: {
//         y: 0,
//         opacity: 1,
//         transition: {
//             y: { duration: 0.1, ease: 'easeOut' },
//             opacity: { duration: 0.1 },
//         },
//     },
//     exit: {
//         y: 2,
//         opacity: 0,
//         transition: {
//             y: { duration: 0.1, ease: 'easeOut' },
//             opacity: { duration: 0.1 },
//         },
//     },
// };

// export function MainLayout({
//     fullSpace,
//     fullHeight,
//     className,
//     onAnimationCompleted,
//     children,
// }: React.PropsWithChildren<MainLayoutProps>) {
//     return (
//         <motion.div
//             {...animation}
//             onAnimationComplete={onAnimationCompleted}
//             className={classNames(
//                 styles.layout,
//                 fullHeight && styles.fullHeight,
//                 fullSpace && styles.fullSpace,
//                 className,
//             )}
//         >
//             {children}
//         </motion.div>
//     );
// }