import { readItem } from "@directus/sdk";
import { useRequest } from "ahooks";
import { Divider, Form, Input, Radio } from "antd";
import { useParams } from "react-router";
import { DebugItem } from "../components/DebugItem";
import { useDirectus } from "../directus";

type FieldType = {
    name: string
    description: string
    status: string
    brand_id: number
}

export function ProductDetail() {
    const [form] = Form.useForm();
    const params = useParams()
    const directus = useDirectus()
    const { data } = useRequest(async () => {
        if (!params.id) return undefined
        return await directus.request(readItem('product', params.id))
    }, {
        onSuccess: (data) => form.setFieldsValue(data)
    })

    return (
        <>
            <Form form={form} labelCol={{ span: 4 }} labelAlign="left" colon={false}>
                <div className="form-grid">
                    <Form.Item<FieldType> className="form-item" label="产品ID">
                        <div>{data?.id}</div>
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="产品名称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="产品说明" name="description">
                        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="状态" name="status">
                        <Radio.Group options={[
                            { value: 'draft', label: '草稿' },
                            { value: 'published', label: '正式' },
                            { value: 'archived', label: '归档' },
                        ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="品牌" name="brand_id">
                        <Input />
                    </Form.Item>
                </div>
                <Divider />
                <div className="form-grid">
                    <Form.Item<FieldType> className="form-item" label="创建人">
                        <div>{data?.user_created}</div>
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="创建时间">
                        <div>{data?.date_created}</div>
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="更新人">
                        <div>{data?.user_updated}</div>
                    </Form.Item>
                    <Form.Item<FieldType> className="form-item" label="更新时间">
                        <div>{data?.date_updated}</div>
                    </Form.Item>
                </div>
            </Form>

            <Divider />
            <DebugItem collection="product" id={params.id} />
        </>
    )
}
