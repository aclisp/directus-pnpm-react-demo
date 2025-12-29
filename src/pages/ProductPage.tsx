import { DebugItem } from '@/components/DebugItem'
import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { LookupSelect } from '@/components/LookupSelect'
import { RelatedList } from '@/components/RelatedList'
import { SystemFields } from '@/components/SystemFields'
import { Title } from '@/components/Title'
import type { Item } from '@/components/types'
import { reviseFormValuesForUpdate } from '@/utils/revise-form-values-for-update'
import { updateItem } from '@directus/sdk'
import type { FormProps } from 'antd'
import { Button, Divider, Form, Input, Radio } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useItemFromPage } from './hooks/use-item-from-page'

interface FormValues {
    name: string
    description: string
    status: 'draft' | 'published' | 'archived'
    brand_id: {
        id: number
        name: string
    }
}

export function ProductPage() {
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
    } = useItemFromPage('product', [
        'id',
        'name',
        'description',
        'status',
        'brand_id.id',
        'brand_id.name',
        'user_created.first_name',
        'user_created.last_name',
        'date_created',
        'user_updated.first_name',
        'user_updated.last_name',
        'date_updated',
    ])

    const [saving, setSaving] = useState(false)

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        setSaving(true)
        const item = reviseFormValuesForUpdate(values)
        const data = await directus.request(updateItem('product', id!, item, { fields })).finally(() => setSaving(false))
        updatePage(data)
    }

    const navigate = useNavigate()

    const createProductReview = () => {
        navigate(`/form/product_reviews/+?product_id.id=${id}&product_id.name=${data?.name}`)
    }

    const createProductCategory = () => {
        navigate(`/form/product_category/+?product_id.id=${id}&product_id.name=${data?.name}`)
    }

    const createProductFile = () => {
        navigate(`/form/product_files/+?product_id.id=${id}&product_id.name=${data?.name}`)
    }

    const createProductSpec = () => {
        navigate(`/form/specification_definition/+?product_id.id=${id}&product_id.name=${data?.name}`)
    }

    const createProductSKU = () => {
        navigate(`/form/stock_keeping_unit/+?product_id.id=${id}&product_id.name=${data?.name}`)
    }

    return (
        <>
            <Title title="产品详情" data={data} />

            <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>

                <FormAction label="操作">
                    <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
                    {isEdit && <Button onClick={createProductFile}>新增图片</Button>}
                    {isEdit && <Button onClick={createProductCategory}>关联品类</Button>}
                    {isEdit && <Button onClick={createProductReview}>添加评论</Button>}
                    {isEdit && <Button onClick={createProductSpec}>添加规格</Button>}
                    {isEdit && <Button onClick={createProductSKU}>添加SKU</Button>}
                </FormAction>

                <div className="form-grid">
                    {isEdit && <ProductID data={data} />}

                    <Form.Item<FormValues> className="form-item" label="产品名称" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="产品说明" name="description">
                        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="状态" name="status">
                        <Radio.Group options={[
                            { value: 'draft', label: '草稿' },
                            { value: 'published', label: '正式' },
                            { value: 'archived', label: '归档' },
                        ]}
                        />
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="品牌" name="brand_id">
                        <LookupSelect
                            allowClear
                            collection="brand"
                            collectionFields={[
                                { field: ['image'], title: '品牌图片', render: { type: 'image' } },
                                { field: ['name'], title: '品牌名称' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item className="form-item"></Form.Item>

                    {isEdit && <ProductFiles data={data} />}
                    {isEdit && <ProductCategory data={data} />}
                    {isEdit && <ProductSpec data={data} />}
                    {isEdit && <ProductSKU data={data} />}
                </div>

                {isEdit && <ProductReviews data={data} />}
                {isEdit && <SystemFields data={data} />}
            </Form1>

            <Divider />
            <DebugItem collection="product" id={id} />
        </>
    )
}

function ProductReviews({ data }: { data?: Item }) {
    return (
        <Form.Item layout="vertical" label="产品评论">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="product_reviews"
                collectionFields={[
                    { field: ['rating'], title: '评分（1-5 星）', width: 130 },
                    { field: ['title'], title: '标题' },
                    { field: ['user_created'], title: '评论者', width: 160, render: { type: 'user' } },
                    { field: ['user_created', 'first_name'], title: '', hidden: true },
                    { field: ['user_created', 'last_name'], title: '', hidden: true },
                ]}
                showEdit
                collectionTitle={['title']}
            />
        </Form.Item>
    )
}

function ProductCategory({ data }: { data?: Item }) {
    return (
        <Form.Item className="form-item" label="产品类别">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="product_category"
                collectionFields={[
                    { field: ['category_id', 'name'], title: '品类名称', render: { type: 'link' } },
                ]}
                collectionTitle={['category_id', 'name']}
            />
        </Form.Item>
    )
}

function ProductFiles({ data }: { data?: Item }) {
    return (
        <Form.Item className="form-item" label="产品图片">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="product_files"
                collectionFields={[
                    { field: ['directus_files_id', 'id'], title: '图片', render: { type: 'image', height: 96, maxWidth: 192, preview: true } },
                ]}
                showEdit
            />
        </Form.Item>
    )
}

function ProductSpec({ data }: { data?: Item }) {
    return (
        <Form.Item className="form-item" layout="vertical" label="产品规格">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="specification_definition"
                collectionFields={[
                    { field: ['name'], title: '规格名称', width: 130, render: { type: 'link' } },
                    { field: ['specification_values'], title: '规格值', render: { type: 'o2m', render: item => item.value } },
                    { field: ['specification_values', 'id'], title: '', hidden: true },
                    { field: ['specification_values', 'value'], title: '', hidden: true },
                ]}
            />
        </Form.Item>
    )
}

function ProductSKU({ data }: { data?: Item }) {
    return (
        <Form.Item className="form-item" layout="vertical" label="产品 SKU">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="stock_keeping_unit"
                collectionFields={[
                    { field: ['code'], title: '编号', width: 130, render: { type: 'link' } },
                    { field: ['specifications'], title: '规格', render: { type: 'o2m', render: item => `${item.specification_value_id.specification_definition_id.name} ${item.specification_value_id.value}` } },
                    { field: ['specifications', 'id'], title: '', hidden: true },
                    { field: ['specifications', 'specification_value_id', 'value'], title: '', hidden: true },
                    { field: ['specifications', 'specification_value_id', 'specification_definition_id', 'name'], title: '', hidden: true },
                ]}
                collectionTitle={['code']}
            />
        </Form.Item>
    )
}

function ProductID({ data }: { data?: Item }) {
    return (
        <Form.Item className="form-item" label="产品ID">
            <div>{data?.id}</div>
        </Form.Item>
    )
}
