import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from '../hooks/use-item-from-page'
import { ProductSpecValueForm, type FormValues } from './ProductSpecValueForm'

export function ProductSpecValuePage() {
    const {
        navigate,
        directus,
        form,
        id,
        prefill,
        data,
        loading,
        isEdit,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    } = useItemFromPage('specification_values', [
        'id',
        'value',
        'specification_definition_id.id',
        'specification_definition_id.name',
        'specification_definition_id.product_id.id',
        'specification_definition_id.product_id.name',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('specification_values', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('specification_values', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="产品规格值" data={data} />
            <ProductSpecValueForm
                form={form}
                data={data}
                loading={loading}
                isEdit={isEdit}
                isDirty={isDirty}
                saving={saving}
                onFinish={onFinish}
                handleValuesChange={handleValuesChange}
                prefill={prefill}
            />
        </>
    )
}
