import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { RelatedList } from '@/components/RelatedList'
import { Title } from '@/components/Title'
import type { Item } from '@/components/types'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, Input, Radio, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    code: string
    status: 'draft' | 'published' | 'archived'
    product_id: string
}

export function ProductSKUPage() {
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
    } = useItemFromPage('stock_keeping_unit', [
        'id',
        'code',
        'status',
        'product_id.id',
        'product_id.name',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('stock_keeping_unit', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('stock_keeping_unit', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    const createProductSKUSpec = () => {
        const params = new URLSearchParams({
            'sku_id.id': String(id),
            'sku_id.code': data?.code,
            'sku_id.product_id.id': data?.product_id.id,
            'sku_id.product_id.name': data?.product_id.name,
        })
        navigate(`/form/stock_keeping_unit_specification_junction/+?` + params.toString())
    }

    return (
        <>
            <Title title="产品 SKU" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                    {isEdit && <Button onClick={createProductSKUSpec}>添加SKU规格</Button>}
                </FormAction>
                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="产品" name="product_id">
                        <LookupSelect
                            collection="product"
                            collectionFields={[
                                { field: ['name'], title: '产品名称' },
                            ]}
                            initialValue={prefill.product_id as LookupSelectValueType}
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="SKU 编号" name="code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="状态" name="status">
                        <Radio.Group options={[
                            { value: 'draft', label: '草稿' },
                            { value: 'published', label: '正式' },
                            { value: 'archived', label: '归档' },
                        ]}
                        />
                    </Form.Item>
                </div>
                {isEdit && <ProductSKUSpecifications data={data} />}
            </Form1>
        </>
    )
}

function ProductSKUSpecifications({ data }: { data?: Item }) {
    return (
        <Form.Item layout="vertical" label="SKU 规格">
            <RelatedList
                foreignKeyField="sku_id"
                foreignKeyValue={data?.id}
                collection="stock_keeping_unit_specification_junction"
                collectionFields={[
                    { field: ['specification_value_id', 'specification_definition_id', 'name'], title: '规格名称', width: 130 },
                    { field: ['specification_value_id', 'value'], title: '规格值' },
                ]}
                showEdit
                collectionTitle={['specification_value_id', 'value']}
            />
        </Form.Item>
    )
}
