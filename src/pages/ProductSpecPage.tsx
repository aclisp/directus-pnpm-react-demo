import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { RelatedList } from '@/components/RelatedList'
import { Title } from '@/components/Title'
import type { Item } from '@/components/types'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, Input, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    name: string
    product_id: string
}

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

    const createProductSpecValue = () => {
        const params = new URLSearchParams({
            'specification_definition_id.id': String(id),
            'specification_definition_id.name': data?.name,
            'specification_definition_id.product_id.id': data?.product_id.id,
            'specification_definition_id.product_id.name': data?.product_id.name,
        })
        navigate(`/form/specification_values/+?` + params.toString())
    }

    return (
        <>
            <Title title="产品规格" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                    {isEdit && <Button onClick={createProductSpecValue}>新增规格值</Button>}
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
                    <Form.Item<FormValues> className="form-item" label="规格名称" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </div>
                {isEdit && <ProductSpecValues data={data} />}
            </Form1>
        </>
    )
}

function ProductSpecValues({ data }: { data?: Item }) {
    return (
        <Form.Item>
            <RelatedList
                foreignKeyField="specification_definition_id"
                foreignKeyValue={data?.id}
                collection="specification_values"
                collectionFields={[
                    { field: ['value'], title: '规格值' },
                ]}
                showEdit
                collectionTitle={['value']}
            />
        </Form.Item>
    )
}
