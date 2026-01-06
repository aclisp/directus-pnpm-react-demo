import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import type { FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from '../hooks/use-item-from-page'
import { BrandForm, type FormValues } from './BrandForm'

export function BrandPage() {
    const {
        navigate,
        directus,
        form,
        id,
        data,
        loading,
        isEdit,
        isDirty,
        fields,
        updatePage,
        handleValuesChange,
    } = useItemFromPage('brand', [
        'id',
        'name',
        'image',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('brand', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('brand', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="品牌" data={data} />
            <BrandForm
                form={form}
                data={data}
                loading={loading}
                isDirty={isDirty}
                saving={saving}
                onFinish={onFinish}
                handleValuesChange={handleValuesChange}
            />
        </>
    )
}
