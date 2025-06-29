import { Navbar } from '@/components/Navbar/Navbar';
import { Text } from '@/uikit';
import { motion } from 'framer-motion';
import styles from './Placeholder.module.scss';

type PlaceholderProps = {
    title: string
    text: string
    image: string
}

export function Placeholder({ title, text, image }: PlaceholderProps) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.root}
            >
                <img
                    className={styles.image}
                    src={image}
                    alt=''
                />

                <div className={styles.content}>
                    <Text
                        type='title'
                        align='center'
                        weight='bold'
                        className={styles.title}
                    >
                        {title}
                    </Text>

                    <Text
                        type='body'
                        align='center'
                        weight='regular'
                        className={styles.text}
                    >
                        {text}
                    </Text>
                </div>
            </motion.div>
            <Navbar />
        </>
    );
}