import { readItem } from '@directus/sdk'
import { useRequest } from 'ahooks'
import type { FormProps } from 'antd'
import { Affix, Button, Flex, Form, Input, Radio, theme } from 'antd'
import { useParams } from 'react-router'
import { LookupSelect } from '../components/LookupSelect'
import { RelatedList } from '../components/RelatedList'
import { useDirectus } from '../directus'
import { datetime } from '../directus/datetime'
import { username } from '../directus/users'

interface FormValues {
    name: string
    description: string
    status: string
    brand_id: {
        id: number
        name: string
    }
}

export function ProductDetail() {
    const [form] = Form.useForm()
    const params = useParams()
    const directus = useDirectus()
    const { token } = theme.useToken()
    const { data } = useRequest(async () => {
        if (!params.id) return undefined
        return await directus.request(readItem('product', params.id, {
            fields: [
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
            ],
        }))
    }, {
        onSuccess: data => form.setFieldsValue(data),
    })
    const onFinish: FormProps<FormValues>['onFinish'] = (values) => {
        console.log('Received values from form: ', values)
    }

    return (
        <>
            <Form form={form} labelCol={{ span: 4 }} labelAlign="left" colon={false} onFinish={onFinish} styles={{ label: { color: token.colorTextSecondary } }}>
                <Form.Item layout="vertical" label="操作">
                    <Affix>
                        <Flex wrap style={{ paddingTop: 8, paddingBottom: 8, gap: 8, backgroundColor: token.colorBgElevated }}>
                            <Button type="primary" htmlType="submit">保存</Button>
                            <Button>新增图片</Button>
                            <Button>关联品类</Button>
                            <Button>添加评论</Button>
                        </Flex>
                    </Affix>
                </Form.Item>
                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="产品ID">
                        <div>{data?.id}</div>
                    </Form.Item>
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
                <Form.Item layout="vertical" label="产品类别">
                    <RelatedList
                        foreignKeyField="product_id"
                        foreignKeyValue={data?.id}
                        collection="product_category"
                        collectionFields={[
                            { field: ['category_id', 'id'], title: '品类ID' },
                            { field: ['category_id', 'name'], title: '品类名称' },
                        ]}
                    />
                </Form.Item>
                <Form.Item layout="vertical" label="产品评论">
                    <RelatedList
                        foreignKeyField="product_id"
                        foreignKeyValue={data?.id}
                        collection="product_reviews"
                        collectionFields={[
                            { field: ['rating'], title: '评分（1-5 星）' },
                            { field: ['content'], title: '内容' },
                            { field: ['user_created', 'email'], title: '评论者' },
                        ]}
                    />
                </Form.Item>
                <div className="form-grid">
                    <Form.Item<FormValues> className="form-item" label="创建人">
                        <div>{username(data?.user_created)}</div>
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="创建时间">
                        <div>{datetime(data?.date_created)}</div>
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="更新人">
                        <div>{username(data?.user_updated)}</div>
                    </Form.Item>
                    <Form.Item<FormValues> className="form-item" label="更新时间">
                        <div>{datetime(data?.date_updated)}</div>
                    </Form.Item>
                </div>
            </Form>

            {/* <Divider />
            <DebugItem collection="product" id={params.id} /> */}
        </>
    )
}
