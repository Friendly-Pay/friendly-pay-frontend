import { StageRoot } from '../Common/StageRoot';
import { CitySelect } from './CitySelect';
import { CountrySelect } from './CountrySelect';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { countries, Country } from '@/states/verification/config';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Input, Text } from '@/uikit';
import { blurFocusedInput } from '@/utils';
import { KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './AddressStage.module.scss';

const VALID_POST_CODE_REGEX = /^[A-Za-z0-9\s-]{1,20}$/;
const RUSSIAN_LETTERS_REGEX = /^[А-ЯЁа-яё]+$/;

export function AddressStage() {
    const [t] = useTranslation();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const initialCountryCode = useVerificationStore(state => state.initialCountryCode);

    const [country, setCountry] = useState<Country | null>(() => countries.find(c => c.iso2 === initialCountryCode) || null);
    const [cityCode, setCityCode] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState<string | undefined>();

    const [postCode, setPostCode] = useState('');
    const [postCodeError, setPostCodeError] = useState<string | undefined>();

    const isCountryAndCityFilled = !!country && cityCode;
    const resetStreetAndPostCode = () => {
        setAddress('');
        setAddressError('');
        setPostCode('');
        setPostCodeError('');
    };

    const handleCountryChange = (country: Country) => {
        setCountry(country);
        setCityCode(null);
        resetStreetAndPostCode();
    };

    const handleCityChange = (cityCode: string) => {
        setCityCode(cityCode);
        resetStreetAndPostCode();
    };

    const handleEnterKeyDown = (index: number): KeyboardEventHandler<HTMLInputElement> => {
        return (evt) => {
            if (evt.key === 'Enter') {
                evt.preventDefault();
                const nextIndex = index + 1;
                if (nextIndex < inputRefs.current.length) {
                    inputRefs.current[nextIndex]?.focus();
                } else {
                    handleSubmit();
                }
            }
        };
    };

    const handleAddressChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        if (newValue.length > 120) return;
        setAddress(newValue);

        if (newValue.length) {
            if (!RUSSIAN_LETTERS_REGEX.test(newValue)) {
                setAddressError(undefined);
            } else {
                setAddressError(t('Enter only Latin letters, digits and symbols'));
            }
        } else {
            setAddressError(undefined);
        }
    };

    const handlePostCodeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        if (newValue.length > 20) return;
        setPostCode(newValue);

        if (newValue.length && !VALID_POST_CODE_REGEX.test(newValue)) {
            setPostCodeError(t('Enter a valid postal code (2–20 letters, digits, spaces or -)'));
        } else {
            setPostCodeError(undefined);
        }
    };

    const isSubmitDisabled =
        !country ||
        !cityCode?.length ||
        !address.length || !!addressError ||
        !postCode.length || !!postCodeError;

    const setStage = useVerificationStore(state => state.setStage);
    const setUserDataProperty = useVerificationStore(state => state.setUserDataProperty);

    const handleSubmit = useCallback(() => {
        if (isSubmitDisabled) return;
        blurFocusedInput();
        setUserDataProperty('country', country.iso2);
        setUserDataProperty('town', cityCode);
        setUserDataProperty('address', address);
        setUserDataProperty('postCode', postCode);
        setStage(VerificationStage.Email);
    }, [isSubmitDisabled, country, cityCode, address, postCode, setStage, setUserDataProperty]);

    return (
        <StageRoot className={styles.content}>
            <Text
                type='headline'
                align='left'
                weight='semibold'
                className={styles.title}
            >{t('Specify your country and home address 🏠')}</Text>

            <CountrySelect
                country={country}
                onSelect={handleCountryChange}
                className={styles.field}
                tabIndex={1}
            />

            {country && <CitySelect
                cityCode={cityCode}
                countryCode={country.iso2}
                onSelect={handleCityChange}
                tabIndex={2}
                className={styles.field}
            />}

            {isCountryAndCityFilled && <>
                <div className={styles.field}>
                    <Input
                        ref={(el) => {
                            inputRefs.current[0] = el;
                        }}
                        type='text'
                        name='address'
                        value={address}
                        onChange={handleAddressChange}
                        onKeyDown={handleEnterKeyDown(0)}
                        placeholder={t('Address')}
                        autoComplete='off'
                        tabIndex={3}
                        enterKeyHint={'next'}
                    />
                    {addressError && <Text
                        type='captionSmall'
                        align='left'
                        className={classNames(styles.caption, styles.error)}
                    >
                        {addressError}
                    </Text>}
                </div>

                <div className={styles.field}>
                    <Input
                        ref={(el) => {
                            inputRefs.current[1] = el;
                        }}
                        type='text'
                        name='postCode'
                        value={postCode}
                        onChange={handlePostCodeChange}
                        onKeyDown={handleEnterKeyDown(1)}
                        placeholder={t('Postcode')}
                        autoComplete='off'
                        tabIndex={4}
                    />
                    {postCodeError && <Text
                        type='captionSmall'
                        align='left'
                        className={classNames(styles.caption, styles.error)}
                    >
                        {postCodeError}
                    </Text>}
                </div>
            </>}

            <TelegramMainButton
                text={t('Continue')}
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            />
        </StageRoot>
    );
}