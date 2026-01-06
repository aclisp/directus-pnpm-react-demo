import { Form1 } from '@/components/Form1'
import { FormAction } from '@/components/FormAction'
import { ImageUpload } from '@/components/ImageUpload'
import type { Item } from '@/components/types'
import type { FormInstance, FormProps } from 'antd'
import { Button, Form, Input } from 'antd'

export interface FormValues {
    name: string
    image: string
}

interface _FormProps {
    form: FormInstance
    data: Item | undefined
    loading: boolean
    isDirty: boolean
    saving: boolean
    onFinish: FormProps<FormValues>['onFinish']
    handleValuesChange: FormProps<FormValues>['onValuesChange']
}

export function BrandForm({
    form,
    loading,
    isDirty,
    saving,
    onFinish,
    handleValuesChange,
}: _FormProps) {
    return (
        <Form1 loading={loading} form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
            <FormAction label="操作">
                <Button type="primary" htmlType="submit" disabled={!isDirty} loading={saving}>保存</Button>
            </FormAction>
            <div className="form-grid">
                <Form.Item<FormValues> className="form-item" label="品牌名称" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FormValues> className="form-item" label="品牌 Logo" name="image" rules={[{ required: true }]}>
                    <ImageUpload />
                </Form.Item>
            </div>
        </Form1>
    )
}
