import { readItem } from "@directus/sdk";
import { useRequest } from "ahooks";
import type { FormProps } from "antd";
import { Button, Divider, Form, Input, Radio } from "antd";
import { useParams } from "react-router";
import { LookupSelect } from "../components/LookupSelect";
import { useDirectus } from "../directus";
import { datetime } from "../directus/datetime";
import { username } from "../directus/users";

type FormValues = {
    name: string
    description: string
    status: string
    brand_id: {
        id: number
        name: string
    }
}

export function ProductDetail() {
    const [form] = Form.useForm();
    const params = useParams()
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        if (!params.id) return undefined
        return await directus.request(readItem('product', params.id, {
            fields: [
                'id',
                'name',
                'description',
                'status',
                {
                    'brand_id': [
                        'id',
                        'name',
                    ],
                },
                {
                    'user_created': [
                        'first_name',
                        'last_name',
                    ],
                },
                'date_created',
                {
                    'user_updated': [
                        'first_name',
                        'last_name',
                    ],
                },
                'date_updated',
            ]
        }))
    }, {
        onSuccess: (data) => form.setFieldsValue(data)
    })
    const onFinish: FormProps<FormValues>['onFinish'] = (values) => {
        console.log('Received values from form: ', values);
    };

    return (
        <>
            <Form form={form} labelCol={{ span: 4 }} labelAlign="left" colon={false} onFinish={onFinish}>
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
                        <LookupSelect allowClear lookupCollection="brand" lookupCollectionFields={[
                            { field: "name", title: "品牌名称" }
                        ]} />
                    </Form.Item>
                </div>
                <Divider />
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
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            {/* <Divider />
            <DebugItem collection="product" id={params.id} /> */}
        </>
    )
}
