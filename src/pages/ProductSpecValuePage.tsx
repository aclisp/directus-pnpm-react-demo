import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, Input, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    value: string
    specification_definition_id: string
}

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
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                </FormAction>
                <div className="form-grid">
                    <Form.Item className="form-item" label="产品">
                        <div>{data?.specification_definition_id.product_id.name}</div>
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="规格名称" name="specification_definition_id">
                        <LookupSelect
                            collection="specification_definition"
                            collectionFields={[
                                { field: ['name'], title: '产品规格' },
                            ]}
                            initialValue={prefill.specification_definition_id as LookupSelectValueType}
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="规格值" name="value" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </div>
            </Form1>
        </>
    )
}
