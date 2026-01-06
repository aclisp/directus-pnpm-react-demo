import type { RelatedItemDrawerProps } from '@/components/RelatedList'
import { useItem } from '@/hooks/use-item'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Drawer, type FormProps } from 'antd'
import { useState } from 'react'
import { ProductSpecForm, type FormValues } from './ProductSpecForm'

export function ProductSpecDrawer({
    prefill,
    relatedItemId,
    onFormFinish,
    ...drawProps
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
    } = useItem('specification_definition', relatedItemId, {
        fields: [
            'id',
            'name',
            'product_id.id',
            'product_id.name',
        ],
        prefill,
    })

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
        onFormFinish(isEdit)
    }

    return (
        <Drawer
            title={(isEdit ? '更新' : '新增') + '规格'}
            size={639}
            {...drawProps}
            forceRender
        >
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
        </Drawer>
    )
}
