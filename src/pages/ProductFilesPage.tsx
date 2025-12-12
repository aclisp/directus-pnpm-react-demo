import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { ImageUpload } from '@/components/ImageUpload'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { Title } from '@/components/Title'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, updateItem } from '@directus/sdk'
import { Button, Form, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    product_id: string
    directus_files_id: string
}

export function ProductFilesPage() {
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
    } = useItemFromPage('product_files', [
        'id',
        'product_id.id',
        'product_id.name',
        'directus_files_id',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('product_files', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            const data = await directus.request(createItem('product_files', item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        }
        navigate(-1)
    }

    return (
        <>
            <Title title="产品图片" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
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
                    <Form.Item<FormValues> className="form-item" label="图片" name="directus_files_id" rules={[{ required: true }]}>
                        <ImageUpload />
                    </Form.Item>
                </div>
            </Form1>
        </>
    )
}
