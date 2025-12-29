import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    sku_id: string
    specification_value_id: string
}

export function ProductSKUSpecPage() {
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
    } = useItemFromPage('stock_keeping_unit_specification_junction', [
        'id',
        'sku_id.id',
        'sku_id.code',
        'sku_id.product_id.id',
        'sku_id.product_id.name',
        'specification_value_id.id',
        'specification_value_id.value',
        'specification_value_id.specification_definition_id.id',
        'specification_value_id.specification_definition_id.name',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('stock_keeping_unit_specification_junction', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('stock_keeping_unit_specification_junction', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="SKU 规格" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                </FormAction>
                <div className="form-grid">
                    <Form.Item className="form-item" label="产品">
                        <div>{data?.sku_id.product_id.name}</div>
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="SKU" name="sku_id">
                        <LookupSelect
                            collection="stock_keeping_unit"
                            collectionFields={[
                                { field: ['code'], title: 'SKU 编号' },
                            ]}
                            valueRender={item => item?.code}
                            initialValue={prefill.sku_id as LookupSelectValueType}
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="规格" name="specification_value_id">
                        <LookupSelect
                            collection="specification_values"
                            collectionFields={[
                                { field: ['specification_definition_id', 'name'], title: '规格名称' },
                                { field: ['value'], title: '规格值' },
                            ]}
                            valueRender={item => item ? `${item?.specification_definition_id.name} ${item?.value}` : ''}
                            filter={{ specification_definition_id: { product_id: data?.sku_id.product_id.id } }}
                        />
                    </Form.Item>
                </div>
            </Form1>
        </>
    )
}
