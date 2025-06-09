import { isSanctionEmail } from '../utils/sanctionEmail';
import { StageRoot } from './common/StageRoot';
import { useUserStore } from '@/states/user/store';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Button, Input, Text } from '@/uikit';
import { blurFocusedInput } from '@/utils';
import { getDateFormatData, parseDateFromFormattedString } from '@/utils/date';
import { maskitoDateOptionsGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './PersonalDataStage.module.scss';

const MIN_BIRTHDAY_DATE = new Date('1900-01-01');
const CURRENT_DATE = new Date();
const VALID_NAME_REGEX = /^[\p{L} '´`‘’‛‑‒–—―\\-]+$/u;
const ONLY_SPECIAL_CHARS_REGEX = /^[ '´`‘’‛‑‒–—―\\-]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

// @TODO кнопка адаптированная под открытую клавиатуру
export function PersonalDataStage() {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | undefined>();
    const emailErrorTimeoutRef = useRef<number | null>(null);

    const [birthday, setBirthday] = useState('');
    const [birthdayError, setBirthdayError] = useState<string | undefined>();
    const birthdayErrorTimeoutRef = useRef<number | null>(null);

    const { separator: dateSeparator, format: dateFormat } = useMemo(() => getDateFormatData(languageCode), [languageCode]);
    const PLACEHOLDER_FORMAT = dateFormat.toLocaleUpperCase().replaceAll('/', dateSeparator);

    const maskitoOptions = maskitoDateOptionsGenerator({
        mode: dateFormat as any,
        separator: dateSeparator
    });

    const birthdayMaskRef = useMaskito({
        options: maskitoOptions
    });

    const [nameFields, setNameFields] = useState({
        firstName: '',
        lastName: '',
    });
    const [invalidNameFlags, setInvalidNameFlags] = useState({
        firstName: false,
        lastName: false,
    });

    const { firstName, lastName } = nameFields;

    const isSubmitDisabled =
        !email.length ||
        !firstName.length ||
        !lastName.length ||
        birthday.length !== dateFormat.length ||
        !!birthdayError ||
        !!emailError ||
        invalidNameFlags.firstName ||
        invalidNameFlags.lastName;

    useEffect(() => {
        return () => {
            if (emailErrorTimeoutRef.current) {
                clearTimeout(emailErrorTimeoutRef.current);
            }
            if (birthdayErrorTimeoutRef.current) {
                clearTimeout(birthdayErrorTimeoutRef.current);
            }
        };
    }, []);

    const handleEnterKeyDown = (index: number): KeyboardEventHandler<HTMLInputElement> => {
        return (evt) => {
            if (evt.key === 'Enter') {
                evt.preventDefault();
                const nextIndex = index + 1;
                // Если есть следующее поле – перейдём к нему
                if (nextIndex < inputRefs.current.length) {
                    inputRefs.current[nextIndex]?.focus();
                } else {
                    handleSubmit();
                }
            }
        };
    };

    const parseInputDate = (input: string) => {
        return parseDateFromFormattedString(input.replaceAll(dateSeparator, '/'), dateFormat);
    };

    const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        if (newValue.length > 100) return;

        setEmail(newValue);
        setEmailError(undefined);
        if (emailErrorTimeoutRef.current) {
            clearTimeout(emailErrorTimeoutRef.current);
        }
        emailErrorTimeoutRef.current = setTimeout(() => {
            if (!newValue.length) {
                setEmailError(t('Enter your email'));
            } else if (!EMAIL_REGEX.test(newValue)) {
                setEmailError(t('Invalid email format'));
            } else if (isSanctionEmail(newValue)) {
                setEmailError(t('This email is not supported'));
            } else {
                setEmailError(undefined);
            }
        }, 1_000);
    };

    const handleNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = evt.target;
        if (value.length > 100) return;

        setNameFields((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (!value) {
            if (invalidNameFlags[name as 'firstName' | 'lastName']) {
                setInvalidNameFlags((prev) => ({
                    ...prev,
                    [name]: false,
                }));
            }
        } else if (VALID_NAME_REGEX.test(value) && !ONLY_SPECIAL_CHARS_REGEX.test(value)) {
            if (invalidNameFlags[name as 'firstName' | 'lastName']) {
                setInvalidNameFlags((prev) => ({
                    ...prev,
                    [name]: false,
                }));
            }
        } else {
            setInvalidNameFlags((prev) => ({
                ...prev,
                [name]: true,
            }));
        }
    };

    const setStage = useVerificationStore(state => state.setStage);
    const setUserDataProperty = useVerificationStore(state => state.setUserDataProperty);
    const handleSubmit = () => {
        if (isSubmitDisabled) return;
        blurFocusedInput();
        setUserDataProperty('email', email);
        setUserDataProperty('birthday', birthday);
        setUserDataProperty('firstName', firstName);
        setUserDataProperty('lastName', lastName);
        setStage(VerificationStage.NeedConfirm);
    };

    return (
        <StageRoot className={styles.root}>
            <div className={styles.content}>
                <Text
                    type='headline'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Personal Data')}
                </Text>

                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Your data is protected.')}
                </Text>

                <div className={styles.field}>
                    <Input
                        ref={(el) => {
                            inputRefs.current[0] = el;
                        }}
                        type='email'
                        name='email'
                        value={email}
                        autoFocus={true}
                        onChange={handleEmailChange}
                        onKeyDown={handleEnterKeyDown(0)}
                        placeholder={t('Email')}
                        autoComplete='off'
                        tabIndex={1}
                        enterKeyHint={'next'}
                    />
                    {emailError && (
                        <Text
                            type="captionSmall"
                            align="left"
                            className={classNames(styles.caption, styles.error)}
                        >
                            {emailError}
                        </Text>
                    )}
                </div>

                <div className={styles.field}>
                    <Input
                        ref={(el) => {
                            inputRefs.current[1] = el;
                        }}
                        type='text'
                        name='firstName'
                        value={firstName}
                        onChange={handleNameChange}
                        onKeyDown={handleEnterKeyDown(1)}
                        placeholder={t('Name')}
                        autoComplete='off'
                        tabIndex={2}
                        enterKeyHint={'next'}
                    />
                    {Boolean(invalidNameFlags.firstName) && <Text
                        type='captionSmall'
                        align='left'
                        className={classNames(styles.caption, styles.error)}
                    >
                        {t('Enter only letters and the following symbols: \' (apostrophe), - (hyphen)')}
                    </Text>}
                </div>
                <div className={styles.field}>
                    <Input
                        ref={(el) => {
                            inputRefs.current[2] = el;
                        }}
                        type='text'
                        name='lastName'
                        value={lastName}
                        onChange={handleNameChange}
                        onKeyDown={handleEnterKeyDown(2)}
                        placeholder={t('LastName')}
                        autoComplete='off'
                        tabIndex={3}
                        enterKeyHint={'next'}
                    />
                    {Boolean(invalidNameFlags.lastName) && <Text
                        type='captionSmall'
                        align='left'
                        className={classNames(styles.caption, styles.error)}
                    >
                        {t('Enter only letters and the following symbols: \' (apostrophe), - (hyphen)')}
                    </Text>}
                </div>

                <div className={styles.field}>
                    <Input
                        ref={(el) => {
                            birthdayMaskRef(el);
                            inputRefs.current[3] = el;
                        }}
                        onKeyDown={handleEnterKeyDown(3)}
                        name="birthday"
                        type="text"
                        value={birthday}
                        onInput={(newValue) => {
                            setBirthday(newValue);
                            if (birthdayErrorTimeoutRef.current) {
                                clearTimeout(birthdayErrorTimeoutRef.current);
                            }
                            if (newValue.length !== dateFormat.length) {
                                setBirthdayError(undefined);
                                birthdayErrorTimeoutRef.current = setTimeout(() => {
                                    if (newValue.length < dateFormat.length) {
                                        setBirthdayError(
                                            t('Enter date in the format {{dateFormat}}', {
                                                dateFormat: t(PLACEHOLDER_FORMAT),
                                            }),
                                        );
                                    }
                                }, 1000);
                            } else {
                                const parsedDate = parseInputDate(newValue);
                                if (parsedDate < MIN_BIRTHDAY_DATE) {
                                    setBirthdayError(t('Date must not be earlier than 1900'));
                                } else if (parsedDate > CURRENT_DATE) {
                                    setBirthdayError(t('Date cannot be in the future'));
                                } else {
                                    setBirthdayError(undefined);
                                }
                            }
                        }}
                        placeholder={t(PLACEHOLDER_FORMAT)}
                        inputMode="numeric"
                        autoComplete="off"
                        tabIndex={4}
                    />
                    {birthdayError && (
                        <Text
                            type="captionSmall"
                            align="left"
                            className={classNames(styles.caption, styles.error)}
                        >
                            {birthdayError}
                        </Text>
                    )}
                </div>
            </div>

            <Button
                view="primary"
                className={styles.button}
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            >
                {t('Continue')}
            </Button>
        </StageRoot>
    );
}