import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect, type LookupSelectValueType } from '@/components/LookupSelect'
import { RelatedList } from '@/components/RelatedList'
import { Title } from '@/components/Title'
import type { Item } from '@/components/types'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { createItem, deleteItem, updateItem } from '@directus/sdk'
import { Button, Form, Input, type FormProps } from 'antd'
import { useState } from 'react'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    parent_id: string
    name: string
}

export function CategoryPage() {
    const {
        navigate,
        directus,
        form,
        id,
        data,
        loading,
        isEdit,
        isDirty,
        setIsDirty,
        fields,
        prefill,
        updatePage,
        handleValuesChange,
        refreshRequest,
    } = useItemFromPage('category', [
        'id',
        'name',
        'parent_id.id',
        'parent_id.name',
        'children',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        if (isEdit) {
            const data = await directus.request(updateItem('category', id!, item, { fields })).finally(() => setSaving(false))
            updatePage(data)
        } else {
            await directus.request(createItem('category', item, { fields })).finally(() => setSaving(false))
            // updatePage(data)
        }
        navigate(-1)
    }

    const createChildCategory = () => {
        const params = new URLSearchParams({
            'parent_id.id': String(id),
            'parent_id.name': data?.name,
            'name': '',
        })
        navigate(`/form/category/+?` + params.toString())
        setIsDirty(true)
    }

    const deleteSelf = async () => {
        await directus.request(deleteItem('category', id!))
        navigate(-1)
    }

    return (
        <>
            <Title title="品类" data={data} />
            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                    {isEdit && <Button onClick={createChildCategory}>新增下级</Button>}
                    {isEdit && data?.children?.length == 0 && <Button variant="outlined" color="danger" onClick={deleteSelf}>删除</Button>}
                </FormAction>
                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="上级品类" name="parent_id">
                        <LookupSelect
                            collection="category"
                            collectionFields={[
                                { field: ['name'], title: '品类名称' },
                            ]}
                            initialValue={prefill.parent_id as LookupSelectValueType}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="品类名称" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </div>
                {isEdit && <ChildCategory data={data} refresh={refreshRequest} />}
            </Form1>
        </>
    )
}

function ChildCategory({ data, refresh }: { data?: Item, refresh: () => void }) {
    return (
        <Form.Item layout="vertical" label="下级品类">
            <RelatedList
                foreignKeyField="parent_id"
                foreignKeyValue={data?.id}
                collection="category"
                collectionFields={[
                    { field: ['name'], title: '品类名称', render: { type: 'link' } },
                ]}
                onActionFinish={refresh}
            />
        </Form.Item>
    )
}
