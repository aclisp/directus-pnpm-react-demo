import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from '../hooks/use-item-from-page'
import { ProductSpecForm, type FormValues } from './ProductSpecForm'

export function ProductSpecPage() {
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
    } = useItemFromPage('specification_definition', [
        'id',
        'name',
        'product_id.id',
        'product_id.name',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('specification_definition', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('specification_definition', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="产品规格" data={data} />
            <ProductSpecForm
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
