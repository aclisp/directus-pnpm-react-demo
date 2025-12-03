import { updateItem } from '@directus/sdk'
import type { FormProps } from 'antd'
import { Affix, Button, Flex, Form, Input, Radio, theme } from 'antd'
import { LookupSelect } from '../components/LookupSelect'
import { RelatedList } from '../components/RelatedList'
import { Title } from '../components/Title'
import type { Item } from '../components/types'
import { datetime } from '../directus/datetime'
import { username } from '../directus/users'
import { reviseFormValuesForUpdate } from '../utils/revise-form-values-for-update'
import { useItemFromPage } from './use-item-from-page'

interface FormValues {
    name: string
    description: string
    status: string
    brand_id: {
        id: number
        name: string
    }
}

export function Product() {
    const { token } = theme.useToken()

    const {
        directus,
        form,
        id,
        data,
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

    const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
        const item = reviseFormValuesForUpdate(values)
        const data = await directus.request(updateItem('product', id!, item, { fields }))
        updatePage(data)
    }

    return (
        <>
            <Title title="产品详情" data={data} />
            <Form form={form} labelCol={{ span: 4 }} labelAlign="left" colon={false} onFinish={onFinish} onValuesChange={handleValuesChange} styles={{ label: { color: token.colorTextSecondary } }}>
                <Form.Item layout="vertical" label="操作">
                    <Affix>
                        <Flex wrap style={{ paddingTop: 8, paddingBottom: 8, gap: 8, backgroundColor: token.colorBgElevated }}>
                            <Button type="primary" htmlType="submit" disabled={!isDirty}>保存</Button>
                            {isEdit && <Button>新增图片</Button>}
                            {isEdit && <Button>关联品类</Button>}
                            {isEdit && <Button>添加评论</Button>}
                        </Flex>
                    </Affix>
                </Form.Item>
                <div className="form-grid">
                    {isEdit && <ProductID data={data} />}

                    <Form.Item<FormValues> className="form-item" label="产品名称" name="name">
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
                </div>
                {isEdit && <ProductFiles data={data} />}
                {isEdit && <ProductCategory data={data} />}
                {isEdit && <ProductReviews data={data} />}
                {isEdit && <SystemFields data={data} />}
            </Form>

            {/* <Divider />
            <DebugItem collection="product" id={id} /> */}
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
            />
        </Form.Item>
    )
}

function ProductCategory({ data }: { data?: Item }) {
    return (
        <Form.Item layout="vertical" label="产品类别">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="product_category"
                collectionFields={[
                    { field: ['category_id', 'id'], title: '品类ID', width: 130 },
                    { field: ['category_id', 'name'], title: '品类名称', render: { type: 'link' } },
                ]}
                collectionTitle={['category_id', 'name']}
            />
        </Form.Item>
    )
}

function ProductFiles({ data }: { data?: Item }) {
    return (
        <Form.Item layout="vertical" label="产品图片">
            <RelatedList
                foreignKeyField="product_id"
                foreignKeyValue={data?.id}
                collection="product_files"
                collectionFields={[
                    { field: ['directus_files_id', 'id'], title: '图片', render: { type: 'image', height: 96, maxWidth: 192, preview: true } },
                ]}
            />
        </Form.Item>
    )
}

function SystemFields({ data }: { data?: Item }) {
    return (
        <div className="form-grid">
            <Form.Item className="form-item" label="创建人">
                <div>{username(data?.user_created)}</div>
            </Form.Item>
            <Form.Item className="form-item" label="创建时间">
                <div>{datetime(data?.date_created)}</div>
            </Form.Item>
            <Form.Item className="form-item" label="更新人">
                <div>{username(data?.user_updated)}</div>
            </Form.Item>
            <Form.Item className="form-item" label="更新时间">
                <div>{datetime(data?.date_updated)}</div>
            </Form.Item>
        </div>
    )
}

function ProductID({ data }: { data?: Item }) {
    return (
        <Form.Item className="form-item" label="产品ID">
            <div>{data?.id}</div>
        </Form.Item>
    )
}
