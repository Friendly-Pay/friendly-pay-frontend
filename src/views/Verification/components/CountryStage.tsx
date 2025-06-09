
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Button, Input, Text } from '@/uikit';
import { Controller, useForm } from 'react-hook-form';
import classNames from 'classnames';
import styles from './CountryStage.module.scss';

type FormData = {
    country: string;
    address: string;
};

export function CountryStage() {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            country: '',
            address: '',
        },
    });

    const onSuccessSubmit = (data: FormData) => {
        const { setUserDataProperty, setStage } = useVerificationStore.getState();
        setUserDataProperty('country', data.country);
        setStage(VerificationStage.NeedConfirm);
    };

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <Text
                    type="title"
                    align="center"
                    weight="semibold"
                >
                    Страна
                </Text>

                <Text
                    type="body"
                    align="center"
                    weight="regular"
                    className={styles.text}
                >
                    Укажите вашу страну проживания
                </Text>

                <Controller
                    name="country"
                    control={control}
                    rules={{
                        required: 'Укажите страну',
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            tabIndex={1}
                            maxLength={64}
                            placeholder="Страна"
                            danger={Boolean(errors.country)}
                        />
                    )}
                />
                {errors.country && (
                    <Text
                        type="captionSmall"
                        align="left"
                        className={classNames(styles.caption, styles.error)}
                    >
                        {errors.country.message}
                    </Text>
                )}
            </div>

            <Button
                view="primary"
                className={styles.button}
                onClick={handleSubmit(onSuccessSubmit)}
                disabled={!isValid}
            >
                Продолжить
            </Button>
        </div>
    );
}