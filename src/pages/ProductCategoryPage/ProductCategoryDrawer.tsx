import type { RelatedItemDrawerProps } from '@/components/RelatedList'
import { useItem } from '@/hooks/use-item'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Drawer, type FormProps } from 'antd'
import { useState } from 'react'
import { ProductCategoryForm, type FormValues } from './ProductCategoryForm'

export function ProductCategoryDrawer({
    prefill,
    relatedItemId,
    onFormFinish,
    ...drawerProps
}: RelatedItemDrawerProps) {
    const {
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
    } = useItem('product_category', relatedItemId, {
        fields: [
            'id',
            'product_id.id',
            'product_id.name',
            'category_id.id',
            'category_id.name',
            'category_id.parent_id.id',
            'category_id.parent_id.name',
        ],
        prefill,
    })

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
        onFormFinish(isEdit)
    }

    return (
        <Drawer
            title={(isEdit ? '更新' : '新增') + '类别'}
            extra={<Button type="primary" disabled={!isDirty} loading={saving} onClick={form.submit}>保存</Button>}
            size={639}
            {...drawerProps}
            forceRender
        >
            <ProductCategoryForm
                hideAction
                form={form}
                data={data}
                loading={loading}
                isDirty={isDirty}
                saving={saving}
                onFinish={onFinish}
                handleValuesChange={handleValuesChange}
                prefill={prefill}
            />
        </Drawer>
    )
}
