import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import type { FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from '../hooks/use-item-from-page'
import { ProductCategoryForm, type FormValues } from './ProductCategoryForm'

export function ProductCategoryPage() {
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
    } = useItemFromPage('product_category', [
        'id',
        'product_id.id',
        'product_id.name',
        'category_id.id',
        'category_id.name',
        'category_id.parent_id.id',
        'category_id.parent_id.name',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('product_category', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('product_category', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="产品类别" data={data} />
            <ProductCategoryForm
                form={form}
                data={data}
                loading={loading}
                isDirty={isDirty}
                saving={saving}
                onFinish={onFinish}
                handleValuesChange={handleValuesChange}
                prefill={prefill}
            />
        </>
    )
}
