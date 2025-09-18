import { BasicInput } from '../components/Field/BasicInput';
import { DateInput } from '../components/Field/DateInput';
import { FileInput } from '../components/Field/FileInput';
import { SelectInput } from '../components/Field/SelectInput';
import { PageRoot } from '../components/PageRoot';
import { BackendField, FieldUserType, uploadBankTransferFile } from '../state/fetch';
import { useBankTransferRequiredFields } from '../state/fields';
import { useBankTransferStore } from '../state/store';
import { MainLayout } from '@/components/common/MainLayout';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useBankTransferPaymentStore } from '@/states/payment/bankTransfer';
import { Spinner, Text } from '@/uikit';
import { FetchStatus } from '@/utils/api';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './DetailsView.module.scss';

type FormData = Record<string, string | File>;

export function DetailsView() {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const fields = useBankTransferRequiredFields(state => state.fields);
    const fieldsStatus = useBankTransferRequiredFields(state => state.status);
    const complianceAdditional = useBankTransferRequiredFields(state => state.complianceAdditional); // Когда банк запросил доп инфу = true

    const [formState, setFormState] = useState<FormData>({});
    const [formErrorsState, setFormErrorsState] = useState<Record<string, string | undefined>>({});

    const groupedFields = useMemo(() => {
        const result: { key: FieldUserType; title: string; fields: BackendField[] }[] = [];
        if (!fields || !fields.length) {
            return result;
        }

        const groupOrder: FieldUserType[] = ['common', 'sender', 'receiver'];
        for (const groupKey of groupOrder) {
            result.push({ key: groupKey, title: '', fields: [] });
        }

        for (const field of fields) {
            const targetGroup = result.find((group) => group.key === field.fieldUserType);
            if (targetGroup) {
                targetGroup.fields.push(field);
            } else {
                const commonGroup = result.find((group) => group.key === 'common');
                if (commonGroup) {
                    commonGroup.fields.push(field);
                }
            }
        }

        for (const group of result) {
            if (group.key === 'sender') group.title = t('Sender');
            if (group.key === 'receiver') group.title = t('Receiver');
        }

        return result;
    }, [fields, t]);

    const validateField = (field: BackendField, value: any): string | undefined => {
        const fieldName = field.fieldDescription || field.fieldTitle || field.fieldName;
        if (!value && value !== 0) {
            return t('Enter value');
        }

        switch (field.fieldType) {
            case 'input':
                const strValue = String(value);
                if (field.regex) {
                    try {
                        const regex = new RegExp(field.regex);
                        if (!regex.test(strValue)) {
                            return t('Invalid format');
                        }
                    } catch {
                        console.error('Invalid regex pattern:', field.regex);
                    }
                }
                if (field.min && strValue.length < field.min) {
                    return t('Minimum length for {{field}} is {{min}}', {
                        field: fieldName,
                        min: field.min
                    });
                }
                if (field.max && strValue.length > field.max) {
                    return t('Maximum length for {{field}} is {{max}}', {
                        field: fieldName,
                        max: field.max
                    });
                }
                break;
        }

        return undefined;
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        setFormState(prev => ({ ...prev, [fieldName]: value }));
        const field = fields?.find(f => f.fieldName === fieldName);
        if (field) {
            const error = validateField(field, value);
            setFormErrorsState(prev => ({ ...prev, [fieldName]: error || undefined }));
        }
    };

    const renderField = (field: BackendField) => {
        const currentValue = formState[field.fieldName] ?? field.fixedValue ?? '';
        const currentError = formErrorsState[field.fieldName];

        switch (field.fieldType) {
            case 'input':
                return (
                    <BasicInput
                        name={field.fieldName}
                        value={String(currentValue)}
                        onInput={(value) => handleFieldChange(field.fieldName, value)}
                        pattern={field.regex || undefined}
                        minLength={field.min ?? undefined}
                        maxLength={field.max ?? undefined}
                        placeholder={t(field.fieldDescription || field.fieldTitle || field.fieldName)}
                        error={currentError}
                        className={styles.field}
                    />
                );

            case 'date':
                return (
                    <DateInput
                        value={String(currentValue)}
                        onInput={(value: string) => handleFieldChange(field.fieldName, value)}
                        error={currentError}
                        placeholder={t(field.fieldDescription || field.fieldTitle || field.fieldName)}
                        className={styles.field}
                    />
                );

            case 'select':
                return (
                    <SelectInput
                        key={field.fieldName}
                        fieldTitle={t(field.fieldTitle || field.fieldName)}
                        selectValues={field.selectValues}
                        value={String(currentValue)}
                        onSelect={(value: string) => handleFieldChange(field.fieldName, value)}
                        error={currentError}
                        className={styles.field}
                    />
                );

            case 'file':
                return (
                    <FileInput
                        key={field.fieldName}
                        name={field.fieldName}
                        label={field.fieldDescription || field.fieldTitle || field.fieldName}
                        value={currentValue as File || null}
                        onChange={(file: File | null) => handleFieldChange(field.fieldName, file ?? '')}
                        error={currentError}
                        className={styles.field}
                    />
                );

            default:
                return null;
        }
    };

    const isFormHasErrors = useMemo(
        () => Object.values(formErrorsState).some((err) => !!err),
        [formErrorsState]
    );

    const hasValueForField = (field: BackendField): boolean => {
        const value = formState[field.fieldName];
        if (value === undefined || value === null) return false;
        return Boolean(value);
    };

    const missingRequiredFieldsCount = useMemo(() => {
        if (!fields || !fields.length) return 0;
        let missing = 0;
        for (const field of fields) {
            if (!hasValueForField(field)) missing += 1;
        }
        return missing;
    }, [fields, formState]);

    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const isSubmitDisabled = isFormHasErrors || missingRequiredFieldsCount > 0;

    const handleSubmit = async () => {
        if (isSubmitDisabled || isSubmitLoading) return;
        setSubmitLoading(true);

        try {
            const fileFieldsToUpload: Array<{ fieldName: string; file: File }> = [];
            if (fields?.length) {
                for (const field of fields) {
                    const maybeValue = formState[field.fieldName];
                    if (maybeValue instanceof File) {
                        fileFieldsToUpload.push({ fieldName: field.fieldName, file: maybeValue });
                    }
                }
            }
            const uploadedFileIds: Record<string, string> = {};
            if (fileFieldsToUpload.length > 0) {
                const results = await Promise.all(
                    fileFieldsToUpload.map((fileItem) =>
                        uploadBankTransferFile(fileItem.file).then(res => ({
                            fieldName: fileItem.fieldName,
                            fileId: res.fileId,
                        }))
                    )
                );
                for (const r of results) {
                    uploadedFileIds[r.fieldName] = r.fileId;
                }
            }

            const payload: Record<string, any> = {};
            if (fields && fields.length) {
                for (const field of fields) {
                    const rawValue = formState[field.fieldName];
                    if (rawValue === undefined || rawValue === null || (typeof rawValue === 'string' && rawValue.trim() === '')) {
                        continue;
                    }
                    if (rawValue instanceof File) {
                        const fileId = uploadedFileIds[field.fieldName];
                        if (!fileId) {
                            setFormErrorsState((prev) => ({ ...prev, [field.fieldName]: t('File not uploaded') }));
                            setSubmitLoading(false);
                            return;
                        }
                        payload[field.fieldName] = fileId;
                    } else {
                        payload[field.fieldName] = rawValue;
                    }
                }
            }

            const { payoutAmount, selectedCurrency, selectedMethod } = useBankTransferStore.getState();
            if (!payoutAmount || !selectedCurrency || !selectedMethod) {
                throw new Error('Bank Transfer required data undefined');
            }

            await useBankTransferPaymentStore.getState().startPayment({
                method: selectedMethod,
                payoutAmount: parseFloat(payoutAmount),
                payoutCurrency: selectedCurrency.currency,
                ...payload
            });
            navigate('/payments/bank-transfer');
        } catch (error) {
            console.error('[bank-transfer] submit error', error);
            toast.error(t('An error occurred. Please contact support'));
        } finally {
            setSubmitLoading(false);
        }
    };

    if (fieldsStatus === FetchStatus.Pending) {
        return (
            <MainLayout>
                <PageRoot>
                    <div className={styles.content}>
                        <Text
                            type='headline'
                            align='left'
                            weight='semibold'
                            className={styles.title}
                        >
                            {t('Loading data, one moment... 😁')}
                        </Text>

                        <Spinner className={styles.spinner} />
                    </div>
                </PageRoot>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <PageRoot>
                <div className={styles.content}>
                    <Text
                        type='headline'
                        align='left'
                        weight='semibold'
                        className={styles.title}
                    >
                        {complianceAdditional ? t('The bank has requested additional information') : t('Fill in the information')}
                    </Text>

                    {groupedFields.map((group) => {
                        if (!group.fields?.length) return null;
                        return (
                            <div
                                key={group.key}
                                className={styles.group}
                            >
                                {group.title && <Text
                                    type='title'
                                    align='left'
                                    weight='semibold'
                                    className={styles.groupTitle}
                                >
                                    {group.title}
                                </Text>}

                                {group.fields.map((field) => renderField(field))}
                            </div>
                        );
                    })}
                </div>

                <TelegramMainButton
                    text={complianceAdditional ? t('Confirm') : t('Continue')}
                    visible
                    onClick={handleSubmit}
                    loading={isSubmitLoading}
                    disabled={isSubmitDisabled}
                />
            </PageRoot>
        </MainLayout>
    );
}