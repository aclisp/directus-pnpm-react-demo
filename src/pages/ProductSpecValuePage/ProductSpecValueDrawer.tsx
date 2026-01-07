import type { RelatedItemDrawerProps } from '@/components/RelatedList'
import { useItem } from '@/hooks/use-item'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Drawer, type FormProps } from 'antd'
import { useState } from 'react'
import { ProductSpecValueForm, type FormValues } from './ProductSpecValueForm'

export function ProductSpecValueDrawer({
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
    } = useItem('specification_values', relatedItemId, {
        fields: [
            'id',
            'value',
            'specification_definition_id.id',
            'specification_definition_id.name',
            'specification_definition_id.product_id.id',
            'specification_definition_id.product_id.name',
        ],
        prefill,
    })

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
        onFormFinish(isEdit)
    }

    return (
        <Drawer
            title={(isEdit ? '更新' : '新增') + '规格值'}
            extra={<Button type="primary" disabled={!isDirty} loading={saving} onClick={form.submit}>保存</Button>}
            size={639}
            {...drawProps}
            forceRender
        >
            <ProductSpecValueForm
                hideAction
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
